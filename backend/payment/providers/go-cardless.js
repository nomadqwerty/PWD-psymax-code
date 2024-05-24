const { GoCardlessClient } = require('gocardless-nodejs/client');
const { SubscriptionIntervalUnit } = require('gocardless-nodejs/types/Types');
const webhooks = require('gocardless-nodejs/webhooks');
const constants = require('gocardless-nodejs/constants');
const PaymentProvider = require('./base').default;
const { ProviderCallbackError } = require('./base');
const { SubscriptionSchema } = require('../../models/subscriptionModel');
const { UserSchema } = require('../../models/userModel');
const dayjs = require('dayjs');
const {
  SubscriptionStatusTracking,
  SubscriptionPlans,
} = require('../../utils/constants');
const { globalExtendedPricing } = require('../../config');
const { InvoiceSchema } = require('../../models/invoiceModel');

/**
 *
 * @param {Number} cycles
 */
function getSubscriptionTrackingStatus(cycles, rewardingAllowed = false) {
  if (cycles > 12) {
    return SubscriptionStatusTracking.COMMITTED;
  } else if (cycles >= 3 && rewardingAllowed) {
    return SubscriptionStatusTracking.REWARDED;
  } else if (cycles < 12) {
    return SubscriptionStatusTracking.SUBSCRIBED;
  }
}

/**
 *
 * @param {number} cycles
 */
function cyclesToDays(cycles) {
  return cycles * 30;
}

/**
 * @typedef {Object} WebhookEvent
 *
 * @property {string} id
 * @property {string} created_at
 * @property {string} action
 * @property {string} resource_type
 * @property {Object} links
 * @property {{origin:string,cause:string,description:string,scheme:string,reason_code:string}} details
 **/

/**
 * @typedef {Object} SubscriptionData
 *
 * @property {string} iban
 * @property {string} given_name
 * @property {string} family_name
 * @property {string} address_line1
 * @property {string} postal_code
 * @property {string} city
 * @property {string} country_code
 * @property {string} account_holder_name
 * @property {string} email
 */

/**
 * @template {}
 */
// class MollieProvider extends PaymentProvider<MollieProvider> {
class GoCardlessProvider extends PaymentProvider {
  /**
   * @type {GoCardlessClient}
   */
  client;

  /**
   *
   * @param {string} apiKey
   */
  constructor(apiKey) {
    super();
    this.baseCurrency = 'EUR';
    this.client = new GoCardlessClient(apiKey, constants.Environments.Sandbox);
  }

  /**
   *
   * @param {number} amount
   * @param {string} cardToken
   * @param {string} currency
   * @param {PaymentMethod} method
   * @param {SequenceType} sequenceType
   * @returns
   */
  async createPayment(amount, cardToken, currency) {
<<<<<<< HEAD
    // Mollie payment processing logic
    try {
      const payment = await this.client.payments.create({
        cardToken,
        amount: {
          currency,
          value: amount.toFixed(2), // Mollie expects amount in cents, so convert to fixed 2 decimal places
        },
        description: 'Payment description',
        redirectUrl: 'https://c9c8-102-215-57-138.ngrok-free.app/orders/123456',
        webhookUrl:
          'https://c9c8-102-215-57-138.ngrok-free.app/api/webhooks/checkout',
      });

      return {
        provider: 'Mollie',
        paymentUrl: payment.getCheckoutUrl(),
      };
    } catch (E) {
      /**
       * @type {MollieApiError}
       */
      const error = E;
      throw new Error('Mollie payment processing error: ' + error.message);
    }
  }

  /**
   *
   * @param {string} email
   * @param {string} name
   * @returns
   */
  async createCustomer(email, name) {
    const customer = await this.client.customers.create({
      name,
      email,
    });
    console.log(customer.id); // save to db.

    return customer;
  }

  /**
   *
   * @param {string} customerId
   * @returns
   */
  getCustomerMandates(customerId) {
    const mandates = this.client.mandates.list({ customer: customerId });
    return mandates;
  }

  async createMandate() {
    const billingRequest = await this.client.billingRequests.create({
      mandate_request: {
        scheme: 'sepa_core',
      },
    });

    const billingRequestFlow = await this.client.billingRequestFlows.create({
      redirect_uri: '',
      exit_uri: 'site.com/checkout-page',
      links: { billing_request: billingRequest.id },
    });

    return {
      provider: 'GoCardless',
      paymentUrl: billingRequestFlow.authorisation_url(),
    };
=======
    throw new Error('createPayment method has not been implemented');
>>>>>>> origin/payment_subscription
  }

  /**
   *
   * @param {string} amount
   * @param {SubscriptionData} subscriptionData
<<<<<<< HEAD
=======
   * @param {string} description
>>>>>>> origin/payment_subscription
   * @returns
   */
  async createSubscription(amount, subscriptionData, description) {
    const billingRequest = await this.client.billingRequests.create({
      mandate_request: {
        scheme: 'sepa_core',
      },
    });
    await this.client.billingRequests.collectCustomerDetails(
      billingRequest.id,
      {
        customer: {
          email: subscriptionData.email,
          given_name: subscriptionData.given_name,
          family_name: subscriptionData.family_name,
        },
        customer_billing_detail: {
          address_line1: subscriptionData.address_line1,
          city: subscriptionData.city,
          postal_code: subscriptionData.postal_code,
          country_code: 'DE',
        },
      }
    );
    await this.client.billingRequests.collectBankAccount(billingRequest.id, {
      // account_number: 'DE89370400440532013000', //Kontonummer
      // bank_code: 'Needed', //Bankleitzahl
      // account_number: '532013000',
      // bank_code: '37040044',
      country_code: 'DE',
      currency: this.baseCurrency,
      account_holder_name: subscriptionData.account_holder_name,
      iban: subscriptionData.iban,
    });
    await this.client.billingRequests.confirmPayerDetails(billingRequest.id);
    const mandate = await this.client.billingRequests.fulfil(billingRequest.id);
    const subscription = await this.client.subscriptions.create(
      {
        //Note that we charge the amount in the lowest denomination for the currency (e.g. pence in GBP, cents in EUR).
        amount: amount * 100, // 1500 == £15, so multiply value by 100
        currency: this.baseCurrency,
        interval: '4',
        interval_unit: SubscriptionIntervalUnit.Weekly,
        name: description,
        links: { mandate: mandate.links.mandate_request_mandate },
        retry_if_possible: true,
      }
      // '0uuid-for-idempotency-key-seems-optional?-prolly-not'
    );
    console.log('Subscript', subscription);
    return subscription;
  }

  /**
   *
   * @param {string} id
   * @param {string} customerId
   * @param {string} startDate
   * @returns
   */
  async updateSubscriptionStartDate(id, customerId, startDate) {
    // FIXME: delete and recreate subscription
    // const subscription = await this.client.subscriptions.update(id, {
    //   // customerId,
    //   // startDate,
    // });
    // return subscription;
  }

  /**
   *
   * @param {string} id
   * @param {string} customerId
   * @returns
   */
  async cancelSubscription(id) {
    const subscription = await this.client.subscriptions.cancel(id);
    return subscription;
  }

  /**
   *
   * @param {string} id
   * @returns
   */
  async getSubscription(id) {
    const subscription = await this.client.subscriptions.find(id);
    return {
      ...subscription,
      nextChargeDate: subscription.upcoming_payments?.[0]?.charge_date,
    };
  }

  async extendSubscription(id, newStartDate) {
    try {
      // Cancel existing subscription
      const oldSubscriptionParams = await this.client.subscriptions.cancel(id);

      // Create a new subscription
      const newSubscription = await this.client.subscriptions.create({
        // Subscription parameters, including the new end date
        ...oldSubscriptionParams,
        start_date: newStartDate.toISOString(),
      });

      console.log('Subscription extended successfully');
      return newSubscription;
    } catch (error) {
      console.error('Error extending subscription:', error);
      // Handle error
    }
  }

  /**
   *
   * @param {string} id
   * @returns
   */
  async getPaymentStatus(id) {
    const payment = await this.client.payments.find(id);
    return payment;
  }

  /**
   *
   * @param {string} referrerId
   * @param {string} subscriptionId
   */
  async rewardReferrer(referrerId, referrerSubscriptionId) {
    const subscriptionOld = await SubscriptionSchema.findById(
      referrerSubscriptionId
    );

    const cyclesNew = subscriptionOld.paidCyclesCount + 1;
    // the existing user (referrer) gets 1 cycle(s) for free
    const user = await UserSchema.findByIdAndUpdate(
      referrerId,
      {
        $inc: { referralBonusCycles: 1 },
      },
      { new: true }
    );

    // cancel current subscription, set renewal date to 45 days ahead, (also set trial end date to 45 days ahead)
    const oldSubscriptionParams = await this.client.subscriptions.cancel(
      subscriptionOld.subscriptionId
    );

    // new date is: current end date + {referralBonusCycles} days
    // {referralBonusCycles} days from now
    const newStartDate = dayjs(oldSubscriptionParams.start_date)
      .add(cyclesToDays(user.referralBonusCycles + 1 ?? 1), 'day')
      .format('YYYY-MM-DD');

    const newSubscriptionParams = await this.client.subscriptions.create(
      {
        ...oldSubscriptionParams,
        start_date: newStartDate,
      }
      // '0uuid-for-idempotency-key-seems-optional?-prolly-not'
    );

    await SubscriptionSchema.findOneAndUpdate(
      { userId: referrerId },
      {
        subscriptionId: newSubscriptionParams.id,
        startDate: newSubscriptionParams.start_date,
        endDate: newSubscriptionParams.end_date,
        statusTracking: getSubscriptionTrackingStatus(cyclesNew),
      }
    );
  }

  /**
   *
   * @param {WebhookEvent} event
   * @returns
   */
  async processPayment(event) {
    /*
     You should keep some kind of record of what events have been processed
     to avoid double-processing, checking if the event already exists
     before processing it.
  
     You should perform processing steps asynchronously to avoid timing out
     if you receive many events at once. To do this, you could use a
     queueing system like
     # Bull https://github.com/OptimalBits/bull
  
     Once you've performed the actions you want to perform for an event, you
     should make a record to avoid accidentally processing the same one twice
   */

    switch (event.action) {
      case 'confirmed':
        return `Payment ${event.links.payment} has been confirmed.\n`;
      default:
        return `Do not know how to process an event with action ${event.action}`;
    }
  }

  /**
   *
   * @param {WebhookEvent} event
   * @returns
   */
  async processSubscription(event) {
    /*
     You should keep some kind of record of what events have been processed
     to avoid double-processing, checking if the event already exists
     before processing it.
  
     You should perform processing steps asynchronously to avoid timing out
     if you receive many events at once. To do this, you could use a
     queueing system like
     # Bull https://github.com/OptimalBits/bull
  
     Once you've performed the actions you want to perform for an event, you
     should make a record to avoid accidentally processing the same one twice
   */

    switch (event.action) {
      case 'payment_created': {
        // TODO: Move non gocardless logic out of here for ..reusability?
        const subscriptionOld = await SubscriptionSchema.findOne({
          subscriptionId: event.links.subscription,
        });

        const cyclesNew = subscriptionOld.paidCyclesCount + 1;

        const subscription = await SubscriptionSchema.findOneAndUpdate(
          {
            subscriptionId: event.links.subscription,
          },
          {
            $inc: { paidCyclesCount: 1 },
            lastPaymentDate: new Date(),
            statusTracking: getSubscriptionTrackingStatus(cyclesNew, true),
          },
          { new: true }
        );

        if (!subscription) {
          // weird
          return;
        }

        // FIXME: ASSUMING THIS PAYMENT IS SUCCESSFUL
        const invoice = new InvoiceSchema({
          userId: subscription.userId,
          referenceId: event.links.payment,
          plan: subscription.plan,
        });
        await invoice.save();
        // FIXME: STOP ASSUMPTION

        // if user has paid >= 12, move to extended plan
        if (
          subscription.paidCyclesCount >= 12 &&
          subscription.plan === SubscriptionPlans.GLOBAL
        ) {
          await this.client.subscriptions.update(subscription.subscriptionId, {
            amount: (globalExtendedPricing * 100).toString(),
          });
          await SubscriptionSchema.findByIdAndUpdate(subscription.id, {
            plan: SubscriptionPlans.GLOBAL_EXTENDED,
          });
        }

        // THE WAY BONUS REWARDING WORKS RN IS BY CANCELLING CURRENT SUBSCRIPTION - WHICH STILL COLLECTS PAYMENT FOR THIS CYCLE.
        // AFTER THAT, WE CREATE NEW SUBSCRIPTION WITH DATE IN THE FUTURE.

        // WHAT'S NEEDED RN IS TO KNOW WHEN THAT NEW SUBSCRIPTION STARTS, THEN RESET THE BONUS COUNT
        // 1. COULD SET "CRONJOB" THAT RUNS AT THAT DATE, THEN RESET

        // 2. BETTER YET, COULD SET A "CRONJOB" THAT RUNS END OF EVERYDAY, AND RESETS EVERYONE'S BONUS COUNT
        // IF THE BONUS COUNT EXP DATE HAS BEEN REACHED. WE CAN KNOW THAT BY QUERYING THE SUBSCRIPTION,
        // THEN GETTING THE START DATE. IF THE START DATE IS THE NEXT DAY, RESET
        // possible tip: QUERY FOR SUBSCRIPTIONS THAT START THE NEXT DAY, THEN FETCH THOSE USERS AND RESET

        // OR WE COULD SAY, EVERY TIME THE USER GETS A REFERRAL PLUS, SIMPLY UPDATE COUNT.
        // THEN END OF DAY, RENEW SUBSCRIPTIONS

        const user = await UserSchema.findById(subscription.userId);
        // THIS CODE BLOCK SHOULD ONLY TRIGGER ONCE PER USER, ONLY IF TRIAL PHASE IS OVER AND 3 CYCLES PAID

        // THIS ENDPOINT ONLY GETS TRIGGERED WHEN TRIAL PERIOD IS OVER

        // CHECK IF 3 CYCLES PAID
        // IF COUNT IS ABOVE 3, IT IS ASSUMED THIS ENDPOINT HAS BEEN CALLED ALREADY.

        if (subscription.paidCyclesCount !== 3) return;

        const referrer = await UserSchema.findById(user.invitedUserId);

        // IF REFERRER IS ADMIN, NO BONUS
        if (referrer.isAdmin) return;

        if (!user) {
          // TODO: weird...
          return;
        }

        if (!referrer) {
          // TODO: weird...
          return;
        }

        const referrerSubscription = await SubscriptionSchema.findOne({
          userId: referrer._id,
        });

        if (!referrerSubscription) {
          // TODO: weird...
          return;
        }
        // is the referrer referred? if so check if has successfully paid 3 cycles
        if (
          referrer.invitedUserId &&
          referrerSubscription.paidCyclesCount < 3
        ) {
          // TODO: NOT SURE ON THIS... just prevent any sort of referral bonus for now
          // check if referrer has paid up to 3 cycles(90 days)
          return;
        }

        await this.rewardReferrer(referrer._id, referrerSubscription._id);

        return `Subscription ${event.links.subscription} has new payment ${event.links.payment} created.\n`;
      }
      case 'payment_confirmed':
        // TODO: Move logic from "payment_created" here after confirmation this exists
        break;
      default:
        return `Do not know how to process an event with action ${event.action}`;
    }
  }

  /**
   *
   * @param {WebhookEvent} event
   * @returns
   */
  processMandate = (event) => {
    /*
     You should keep some kind of record of what events have been processed
     to avoid double-processing, checking if the event already exists
     before processing it.
  
     You should perform processing steps asynchronously to avoid timing out
     if you receive many events at once. To do this, you could use a
     queueing system like
     # Bull https://github.com/OptimalBits/bull
  
     Once you've performed the actions you want to perform for an event, you
     should make a record to avoid accidentally processing the same one twice
   */

    switch (event.action) {
      case 'cancelled':
        return `Mandate ${event.links.mandate} has been cancelled.\n`;
      default:
        return `Do not know how to process an event with action ${event.action}`;
    }
  };

  /**
   *
   * @param {WebhookEvent} event
   * @returns
   */
  processEvent = (event) => {
    console.log('Event is', event);
    switch (event.resource_type) {
      case 'mandates':
        return this.processMandate(event);
      case 'payments':
        return this.processPayment(event);
      case 'subscriptions':
        return this.processSubscription(event);
      default:
        console.log(event);
        return `Do not know how to process an event with resource_type ${event.resource_type}`;
    }
  };

  /**
   * @param  {import('express').Request} request
   */
  async handleCallback(request) {
    const body = request.body;

    const webhookEndpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;
    const signatureHeader = request.headers['webhook-signature'];

    /**
     * @param {string} eventRequestBody
     * @param {string} webhookEndpointSecret
     * @param {string} signatureHeader
     *
     * @returns {Array<WebhookEvent>}
     **/
    const parseEvents = (
      eventRequestBody,
      webhookEndpointSecret,
      signatureHeader
    ) => {
      try {
        return webhooks.parse(
          // eventRequestBody,
          JSON.stringify(eventRequestBody),
          webhookEndpointSecret,
          signatureHeader
        );
      } catch (error) {
        if (error instanceof webhooks.InvalidSignatureError) {
          console.log('Invalid signature from webhook, ignoring...');
        }
        console.log(error);
        throw Error('An odd error occurred when parsing event: ' + error);
      }
    };

    const events = parseEvents(body, webhookEndpointSecret, signatureHeader);
    try {
      for (const event of events) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.log('Error occurred handling webhook event', error);
      throw new ProviderCallbackError(
        'Error occurred handling webhook event',
        500
      );
    }
    return true;
  }
}

module.exports = GoCardlessProvider;
