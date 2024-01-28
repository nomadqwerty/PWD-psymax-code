const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailAppSchema = new Schema({
  KlientId: {
    type: Schema.Types.ObjectId,
    ref: 'Klient',
  },
  KlientChiffre: {
    type: String,
    trim: true,
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
  Attachments: {
    type: Array,
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

const EmailSchema = mongoose.model('email', emailAppSchema);

module.exports = { EmailSchema };
