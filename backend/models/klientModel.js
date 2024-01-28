const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const klientAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
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
  Anrede: {
    type: String,
    required: true,
  },
  Titel: {
    type: String,
  },
  Firma: {
    type: String,
    required: true,
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
  Diagnose: {
    type: Array,
    trim: true,
  },
  Geburtsdatum: {
    type: String,
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
});

const KlientSchema = mongoose.model('klient', klientAppSchema);

module.exports = { KlientSchema };
