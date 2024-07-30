const mongoose = require('mongoose');
const {
  SubscriptionPlans,
  SubscriptionStatusTracking,
  PaymentMethods,
} = require('../utils/constants');
const Schema = mongoose.Schema;

const subscriptionAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  statusTracking: {
    type: String,
    enum: Object.values(SubscriptionStatusTracking),
    required: true,
  },
  subscriptionId: { type: String, required: true },
  plan: {
    type: String,
    enum: Object.values(SubscriptionPlans),
    default: SubscriptionPlans.GLOBAL,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  lastPaymentDate: { type: Date },
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELED', 'PAUSED'],
    default: 'ACTIVE',
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethods),
    required: true,
  },
  discount: Number,
  paidCyclesCount: {
    type: Number,
    default: 0,
  },
  lastCreatedPaymentId: String,
});

const SubscriptionSchema = mongoose.model(
  'subscriptions',
  subscriptionAppSchema
);

module.exports = { SubscriptionSchema };
