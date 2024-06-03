const mongoose = require('mongoose');
const QuestionnaireResponseModel = require('./questionnaireResponseModel');
const Schema = mongoose.Schema;

const klientAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  isEncrypted:{
    type:Boolean,
    required:[true, 'indicate if vault is encrypted']
  },
  userChiffre: {
    type: String,
    required: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
  },
  Chiffre: {
    type: String,
    required: true,
  },
  // TODO: turn fields to buffers.
  Anrede: {
    type: Buffer,
    required: true,
  },
  Titel: {
    type: Buffer,
  },
  Firma: {
    type: Buffer,
    required: true,
  },
  Vorname: {
    type: Buffer,
    trim: true,
  },
  Nachname: {
    type: Buffer,
    trim: true,
  },
  Strasse_und_Hausnummer: {
    type: Buffer,
    trim: true,
  },
  PLZ: {
    type: Buffer,
    trim: true,
  },
  Ort: {
    type: Buffer,
    trim: true,
  },
  Land: {
    type: Buffer,
    trim: true,
  },
  Telefonnummer: {
    type: String,
    trim: true,
  },
  Diagnose: {
    type:Buffer,
    trim: true,
  },
  Geburtsdatum: {
    type: Buffer,
    trim: true,
  },
  ArztId: {
    type: Schema.Types.ObjectId,
    ref: 'arzt', // Doctors
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Number,
    default: 0,
  },
  deletedAt: {
    type: Date,
  },
  status: {
    type: Number,
    default: 1, // 1-Active, 2-Archive
  },
  // klients to not be included in sending emails for questionnaires
  excludeInQuestionnaire: {
    type: Boolean,
    default: false,
  },
});

// when klient is deleted (isDeleted set to 1), delete their questionnaire response instances too
klientAppSchema.pre('findOneAndUpdate', async function (next) {
  const isDeleted = this._update?.isDeleted;
  const klientId = this._update?._id;

  if (!isDeleted || !klientId) return next();

  await QuestionnaireResponseModel.deleteMany({
    klient: klientId,
  });

  next();
});

const KlientSchema = mongoose.model('klient', klientAppSchema);

module.exports = { KlientSchema };
