const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const briefAppSchema = new Schema({
  KlientId: {
    type: Schema.Types.ObjectId,
    ref: 'Klient',
    default: null,
  },
  KlientChiffre: {
    type: String,
    trim: true,
    default: null,
  },
  ArztId: {
    type: Schema.Types.ObjectId,
    ref: 'arzt',
    default: null,
  },
  Templete: {
    type: String,
    trim: true,
    default: null,
  },
  Betreff: {
    type: String,
    trim: true,
    required: true,
  },
  Inhalt: {
    type: String,
    trim: true,
  },
  Unterschriftsfeld1: {
    type: String,
    trim: true,
    required: true,
  },
  Unterschriftsfeld2: {
    type: String,
    trim: true,
    required: true,
  },
  OptionSelected: {
    type: Number,
    required: true,
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
});

const BriefSchema = mongoose.model('brief', briefAppSchema);

module.exports = { BriefSchema };
