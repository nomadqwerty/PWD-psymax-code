const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const globalPointsAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  value: {
    type: Number,
    trim: true,
    required: true,
  },
});

const GlobalPointsSchema = mongoose.model(
  'globalPoints',
  globalPointsAppSchema
);

module.exports = { GlobalPointsSchema };
