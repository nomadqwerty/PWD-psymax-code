const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arztAppSchema = new Schema({
  Anrede: {
    type: String,
    trim: true,
  },
  Titel: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  Vorname: {
    type: String,
    trim: true,
  },
  Nachname: {
    type: String,
    trim: true,
  },
  Strasse_und_Hausnummer: {
    type: String,
    trim: true,
  },
  PLZ: {
    type: String,
    trim: true,
  },
  Ort: {
    type: String,
    trim: true,
  },
  Land: {
    type: String,
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
