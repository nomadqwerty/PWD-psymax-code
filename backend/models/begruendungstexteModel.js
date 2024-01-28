const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const begruendungstexteAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  userChiffre: {
    type: String,
    required: true,
  },
  begruendungstexte: {
    type: String,
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

begruendungstexteAppSchema.index(
  { begruendungstexte: 'text' },
  { default_language: 'german' }
);

const BegruendungstexteSchema = mongoose.model(
  'begruendungstexte',
  begruendungstexteAppSchema
);

module.exports = { BegruendungstexteSchema };
