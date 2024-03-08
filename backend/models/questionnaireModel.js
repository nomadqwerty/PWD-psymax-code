const fs = require('fs');
const path = require('path');
const { KlientSchema } = require('./klientModel');
const { UserSchema } = require('./userModel');
const mongoose = require('mongoose');
const QuestionnaireResponseModel = require('./questionnaireResponseModel');

const { sendSMTPMail } = require('../utils/common');

const questionnaireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Please add a user id.'],
  },
  name: {
    type: String,
    required: [true, 'Please give the questionnaire a name.'],
  },
  questions: {
    type: [
      {
        id: Number,
        question: String,
        isRecoded: Boolean,
        isRating: Boolean,
        fragetext: String || null,
      },
    ],
    required: [true, 'Please add at least 1 question.'],
  },
  randomizeQuestions: {
    type: Boolean,
    default: false,
  },
  scale: {
    type: [
      {
        name: String,
        value: Number,
      },
    ],
    required: [true, 'Please add a scale.'],
  },
  // how often the questionnaire should be filled
  fillingFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'biWeekly', 'monthly', 'quarterly'],
    default: 'monthly',
  },
  // how the questionnaire should be allocated to clients
  allocatedTo: {
    type: String,
    enum: ['allClients', 'newClients', 'manual', 'unallocated'],
    default: 'unallocated',
  },
  // clients assigned to the questionnaire
  clientsAssigned: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'klient',
      },
    ],
    default: [],
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// populate the clientsAssigned field with the clients' first and last names, and id
questionnaireSchema.pre(/find/, function (next) {
  this.populate('clientsAssigned', 'Vorname Nachname _id');
  next();
});

// on post save, if allocatedTo has changed, initialize new questionnaire responses
questionnaireSchema.pre('findOneAndUpdate', async function (next) {
  const userId = this._update?.userId;
  const questionnaireId = this._update?._id;
  const clientsAssigned = this._update?.clientsAssigned;

  if (!userId || !questionnaireId || !clientsAssigned) return next();

  // if the clients assigned list is empty, and it has changed, delete all questionnaire responses for the questionnaire
  if (clientsAssigned?.length === 0) {
    await QuestionnaireResponseModel.deleteMany({
      questionnaire: questionnaireId,
    });
    return next();
  }

  // map over the clients assigned to the questionnaire and initialize a questionnaire response for each client
  clientsAssigned.forEach(async (client) => {
    // if the client is excluded from the questionnaire, don't initialize a questionnaire response, and remove any existing questionnaire responses
    if (client.excludeInQuestionnaire) {
      await QuestionnaireResponseModel.deleteMany({
        questionnaire: questionnaireId,
        klient: client._id,
      });
      return next();
    }

    // check if the questionnaire has already been initialized for each client
    const questionnaireResponses = await QuestionnaireResponseModel.find({
      questionnaire: questionnaireId,
      klient: client._id,
    });

    // set expiresAt based on the questionnaire's fillingFrequency
    let expiresAt = new Date();
    const questionnaire = await this.model.findOne({ _id: questionnaireId });
    const fillingFrequency = questionnaire.fillingFrequency;

    switch (fillingFrequency) {
      case 'daily':
        expiresAt.setDate(expiresAt.getDate() + 1);
        break;
      case 'weekly':
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;
      case 'biWeekly':
        expiresAt.setDate(expiresAt.getDate() + 14);
        break;
      case 'quarterly':
        expiresAt.setDate(expiresAt.getDate() + 90);
        break;
      // default to monthly
      default:
        expiresAt.setDate(expiresAt.getDate() + 30);
        break;
    }

    // if the questionnaire has already been initialized, update the expiresAt date
    if (questionnaireResponses.length > 0) {
      await QuestionnaireResponseModel.updateMany(
        {
          questionnaire: questionnaireId,
          klient: client._id,
          user: userId,
        },
        {
          expiresAt,
        }
      );
      return next();
    }

    // if the client is not excluded from the questionnaire, initialize a questionnaire response
    const newQuestionnaireResponse = await QuestionnaireResponseModel.create({
      questionnaire: questionnaireId,
      klient: client._id,
      user: userId,
      expiresAt,
    });

    // console.log('Client responses initialized! ✅');

    // send an email to the client
    const accessCode = await sendQuestionnaireEmail(newQuestionnaireResponse);

    // save the access code to the questionnaire response
    await QuestionnaireResponseModel.findByIdAndUpdate(
      newQuestionnaireResponse._id,
      {
        accessCode,
      }
    );
  });

  next();
});

// whenever a questionnaire is deleted, delete all questionnaire responses for the questionnaire
questionnaireSchema.pre('findOneAndDelete', async function (next) {
  const questionnaireId = this._conditions?._id;

  if (!questionnaireId) return next();

  await QuestionnaireResponseModel.deleteMany({
    questionnaire: questionnaireId,
  });

  // console.log('Questionnaire responses deleted! ✅');

  next();
});

// on post save, send an email to all clients assigned to the questionnaire
const sendQuestionnaireEmail = async (qResponse) => {
  try {
    // get the client's email
    const client = await KlientSchema.findById(qResponse.klient);
    const user = await UserSchema.findById(qResponse.user);

    let message = fs.readFileSync(
      path.join(__dirname, '../html/emails/questionnaire.html'),
      'utf8'
    );

    // create an encoded 9 digit/alphanumeric long (XXX-XXX-XXX) code from the qresponse mongodb _id. Pick 9 random characters from the _id string and insert dashes at the 3rd and 6th position.
    const code = qResponse._id
      .toString()
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')
      .slice(0, 9)
      .replace(/(.{3})/g, '$1-')
      .slice(0, -1);

    message = replacePlaceholders(message, client, user, code);
    const subject = 'Fragebogen zur Selbstbeurteilung';

    const attachments = [
      {
        filename: 'psymax_logo.png',
        path: path.join(__dirname, '../public', 'pdfLogo.png'),
        cid: 'emailLogo',
      },
    ];

    // send the email
    sendSMTPMail(
      client.email,
      subject,
      message,
      attachments,
      [],
      [user.email]
    );

    // console.log('Email sent! ✅');
    return code;
  } catch (error) {
    console.log(error);
  }
};

// replace placeholders in the email template with the client's information
const replacePlaceholders = (message, client, user, code) => {
  if (!client || !user || !code) return '';
  return message
    .replace(/{{Klient_Titel}}/g, client.Titel || '')
    .replace(/{{Klient_Vorname}}/g, client.Vorname || '')
    .replace(/{{Klient_Nachname}}/g, client.Nachname || '')
    .replace(/{{Code}}/g, code || '')
    .replace(/{{Titel}}/g, user.title || '')
    .replace(/{{Vorname}}/g, user.Vorname || '')
    .replace(/{{Nachname}}/g, user.Nachname || '')
    .replace(/{{Praxistitel}}/g, user.Praxistitel || '')
    .replace(/{{Praxisbezeichnung}}/g, user.Praxisbezeichnung || '')
    .replace(/{{Strasse_und_Hausnummer}}/g, user.Strasse_und_Hausnummer || '')
    .replace(/{{Ort}}/g, user.Ort || '')
    .replace(/{{PLZ}}/g, user.PLZ || '')
    .replace(/{{Telefon}}/g, user.Telefon || '')
    .replace(/{{Email}}/g, user.Email || '')
    .replace(/{{Website}}/g, user.Website || '');
};

const QuestionnaireModel = mongoose.model(
  'questionnaires',
  questionnaireSchema
);

module.exports = QuestionnaireModel;
