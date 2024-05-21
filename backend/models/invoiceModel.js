const mongoose = require('mongoose');
const { SubscriptionPlans } = require('../utils/constants');
const Schema = mongoose.Schema;

const invoiceAppSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  // invoiceId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'invoices',
  //   required: true,
  // },
  referenceId: { type: String },
  plan: {
    type: String,
    enum: Object.values(SubscriptionPlans),
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InvoiceSchema = mongoose.model('invoices', invoiceAppSchema);

module.exports = { InvoiceSchema };
