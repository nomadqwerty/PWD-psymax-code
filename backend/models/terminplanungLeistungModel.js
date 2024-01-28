const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terminplanungLeistungAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  Leistung: {
    type: String,
    trim: true,
    required: true,
  },
  Dauer: {
    type: String,
    trim: true,
    required: true,
  },
  Kosten: {
    type: Number,
    trim: true,
    required: true,
  },
  Beschreibung: {
    type: String,
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

const TerminplanungLeistungSchema = mongoose.model(
  'terminplanungLeistung',
  terminplanungLeistungAppSchema
);

module.exports = { TerminplanungLeistungSchema };
