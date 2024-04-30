const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  subscriptionId: { type: String, required: true },
  plan: {
    type: String,
    enum: ['GLOBAL', 'GLOBAL_EXTENDED'],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELED', 'PAUSED'],
    required: true,
  },

  paidCyclesCount: {
    type: Number,
    default: 0,
  },
});

const SubscriptionSchema = mongoose.model(
  'subscriptions',
  subscriptionAppSchema
);

module.exports = { SubscriptionSchema };
