const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arztAppSchema = new Schema({
  Anrede: {
    type: Buffer,
    trim: true,
  },
  Titel: {
    type: Buffer,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
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

const ArztSchema = mongoose.model('arzt', arztAppSchema);

module.exports = { ArztSchema };
