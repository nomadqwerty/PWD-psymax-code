const mongoose = require('mongoose');

const questionnaireResponseSchema = new mongoose.Schema({
  questionnaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'questionnaires',
    required: true,
  },
  klient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'klient',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  accessCode: {
    type: String,
    default: null,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  responses: {
    type: [
      {
        questionId: {
          type: Number,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          default: null,
        },
      },
    ],
    default: [],
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

// in pre find, populate with klient name and chiffre, and questionnaire name and creationDate
questionnaireResponseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'klient',
    select: 'Vorname Nachname Chiffre',
  }).populate({
    path: 'questionnaire',
    select: 'name creationDate questions scale',
  });
  next();
});

const QuestionnaireResponseModel = mongoose.model(
  'QuestionnaireResponse',
  questionnaireResponseSchema
);

module.exports = QuestionnaireResponseModel;
