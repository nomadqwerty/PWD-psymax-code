const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAppSchema = new Schema({
  Chiffre: {
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
  },
  password: {
    required: true,
    type: String,
    trim: true,
  },
  confirmPassword: {
    type: String,
    trim: true,
  },
  Anrede: {
    type: String,
    trim: true,
  },
  Titel: {
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
  Geburtsdatum: {
    type: Date,
    trim: true,
  },
  Telefon: {
    type: String,
    trim: true,
  },
  Website: {
    type: String,
    trim: true,
  },
  Berufsbezeichnung: {
    type: String,
    trim: true,
  },
  Praxistitel: {
    type: String,
    trim: true,
  },
  Praxisbezeichnung: {
    type: String,
    trim: true,
  },
  Praxisbeschreibung: {
    type: String,
    trim: true,
  },
  Logo: {
    type: String,
    trim: true,
  },
  Primaerfarbe: {
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
  Steuernummer: {
    type: String,
    trim: true,
  },
  Bankname: {
    type: String,
    trim: true,
  },
  BIC: {
    type: String,
    trim: true,
  },
  IBAN: {
    type: String,
    trim: true,
  },
  invoiceEmail: {
    type: String,
    trim: true,
  },
  StandardSalesTax: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  isAdmin: {
    required: true,
    type: Number,
    default: 0,
  },
  status: {
    required: true,
    type: Number,
    default: 0, // 0 - pending, 1 - activated, 2 - deactivated, 3 - deleted
  },
  /* isFirst: {
    type: Number,
    default: 1,
  }, */
  TwoFA: {
    type: Schema.Types.Mixed,
  },
  inviteCode: {
    type: String,
    trim: true,
  },
  invitedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
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
  trialDays: {
    type: Number,
  },
  trialEnd: {
    type: Date,
    required: true,
  },
  trialPeriodActive: { type: Boolean },
  referralBonusCycles: { type: Number },
  emergencyPassword: {
    type: String,
    required: [true, 'emergency password required'],
  },
  recoveryKey: {
    type: Buffer,
    default: '',
  },
  recoveryPhrase: {
    type: String,
  },
});

const UserSchema = mongoose.model('users', userAppSchema);

module.exports = { UserSchema };
