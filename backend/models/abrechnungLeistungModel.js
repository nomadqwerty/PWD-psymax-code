const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const abrechnungLeistungAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  Leistung: {
    type: String,
    trim: true,
    required: true,
  },
  GopNr: {
    type: String,
    trim: true,
    required: true,
  },
  Punktwert: {
    type: Number,
    trim: true,
    required: true,
  },
  Leistungsbeschreibung: {
    type: String,
    trim: true,
    required: true,
  },
  Standardanzahl: {
    type: Number,
    trim: true,
    required: true,
  },
  Standardfaktor: {
    type: Number,
    trim: true,
    required: true,
  },
  Betrag: {
    type: Number,
    trim: true,
    required: true,
  },
  ManuellerBetrag: {
    type: Number,
    trim: true,
    required: true,
  },
  Umsatzsteuerwahl: {
    type: String,
    trim: true,
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

const AbrechnungLeistungSchema = mongoose.model(
  'abrechnungLeistung',
  abrechnungLeistungAppSchema
);

module.exports = { AbrechnungLeistungSchema };
