const { ProviderCallbackError } = require('../payment/providers/base');
const { PaymentMethod } = require('@mollie/api-client');
const createPaymentService = require('../payment/services/payment');
const Joi = require('joi');
const { SubscriptionSchema } = require('../models/subscriptionModel');
const dayjs = require('dayjs');

const paymentService = createPaymentService();
/**
 * @type {import('express').Handler}
 */
async function makePayment(req, res, next) {
  const { cardToken } = req.body;
  let url = null;

  try {
    // let t = await paymentService.processPayment(
    let t = await paymentService.processPayment(
      90,
      cardToken,
      'EUR',
      PaymentMethod.creditcard
    );
    url = t.paymentUrl;
    console.log('URL is', url);
  } catch (e) {
    next(e);
    // return { message: e };
  }

  console.log('red is', url);
  if (url) res.redirect(url);
}

/**
 * @type {import('express').Handler}
 */
async function makeSubscription(req, res, next) {
  const subscriptionData = req.body;
  const userId = req.user.user_id;

  // TODO: Validation on card fields

  const subscriptionSchema = Joi.object({
    // iban: Joi.string().required(),
    // given_name: Joi.string().required(),
    // family_name: Joi.string().required(),
    // address_line1: Joi.string().required(),
    // postal_code: Joi.string().required(),
    // city: Joi.string().required(),
    // country_code: Joi.string().required(),
    // email: Joi.string().email().required(),
    // account_holder_name: Joi.string().required(),
  });

  const { error } = subscriptionSchema.validate(req.body);

  if (error) {
    let response = {
      status_code: 400,
      message: error?.details[0]?.message,
      data: error,
    };
    return res.status(400).send(response);
  }

  let url = null;

  try {
    // Check if user has an active subscription
    const existingSubscription = await SubscriptionSchema.findOne({
      userId,
      status: 'active',
    });
    if (existingSubscription) {
      return res
        .status(400)
        .json({ msg: 'User already has an active subscription' });
    }

    // let t = await paymentService.processPayment(
    let t = await paymentService.createSubscription(90, subscriptionData);
    url = t.paymentUrl;
    console.log('URL is', url);

    // Create new subscription
    const newSubscription = new SubscriptionSchema({
      userId,
      plan: req.body.plan,
      startDate: new Date(),
      endDate: dayjs().add(30, 'days').toDate(),
      status: 'active',
    });

    // Save subscription to database
    await newSubscription.save();

    // Update user's subscriptionEnd date
    // await User.findByIdAndUpdate(userId, {
    //   subscriptionEnd: newSubscription.endDate,
    // });
    res.json({ msg: 'Subscription activated successfully' });
  } catch (e) {
    // next(e);
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }

  // console.log('red is', url);
  // if (url) res.redirect(url);
}

async function getPaymentStatus(id) {
  return await paymentService.getPaymentStatus(id);
}

/**
 * @type {import('express').Handler}
 */
async function getSubscriptionByUser(req, res) {
  const userId = req.params.userId;
  const subscription = SubscriptionSchema.findOne({ userId });

  res.json({ data: subscription });
}

/**
 * @type {import('express').Handler}
 */
async function webhookHandler(req, res, next) {
  try {
    await paymentService.handleCallback(req);
  } catch (error) {
    console.error(error);

    if (error instanceof ProviderCallbackError) {
      return res
        .status(error.statusCode)
        .json({ message: `Webhook Error: ${error.message}` });
    }
    return res.status(500).json({ message: 'Webhook handler failed' });
  }
  return res.json({ message: 'Received' });
}

module.exports = {
  makePayment,
  makeSubscription,
  getPaymentStatus,
  webhookHandler,
  getSubscriptionByUser,
};
