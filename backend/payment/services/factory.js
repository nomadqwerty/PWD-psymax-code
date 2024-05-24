const { PaymentMethods } = require('../../utils/constants');
<<<<<<< HEAD
const { WireTransferProvider } = require('../queues/wire-transfer');

const PaymentProvider = require('../providers/base').default;
=======
>>>>>>> origin/payment_subscription

/**
 * Creates a new provider, providers must be PCI compliant and use 3-D Secure Auth
 *
<<<<<<< HEAD
 * @template {PaymentProvider} T
=======
 * @template {import('../providers/base').default} T
>>>>>>> origin/payment_subscription
 */
class PaymentProviderFactory {
  /**
   * @param {T} paymentProvider
<<<<<<< HEAD
   * @param {WireTransferProvider} wireTransferProvider
=======
   * @param {import('../queues/wire-transfer').WireTransferProvider} wireTransferProvider
>>>>>>> origin/payment_subscription
   */
  constructor(paymentProvider, wireTransferProvider) {
    this.paymentProvider = paymentProvider;
    this.wireTransferProvider = wireTransferProvider;
  }

  /**
<<<<<<< HEAD
   * @param {Parameters<T['processPayment']>} args
   * @returns
   */
  async processPayment(...args) {
    try {
      const transactionId = await this.paymentProvider.processPayment(...args);
      console.log('TXN IS', transactionId);
      return transactionId;
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
=======
   * @param {Parameters<T['createPayment']>} args
   * @returns
   */
  async createPayment(...args) {
    try {
      const payment = await this.paymentProvider.createPayment(...args);
      return payment;
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
>>>>>>> origin/payment_subscription
    }
  }

  /**
   * @param {keyof PaymentMethods} method
<<<<<<< HEAD
   * @param {Parameters<T['processPayment']>} args
   * @returns
=======
   * @param {Parameters<T['createSubscription']>} args
   * @returns {ReturnType<T['createSubscription']>}
>>>>>>> origin/payment_subscription
   */
  async createSubscription(method, ...args) {
    try {
      let subscription;
      if (method === PaymentMethods.WIRE_TRANSFER) {
<<<<<<< HEAD
        console.log('Wire is: ', args);
=======
>>>>>>> origin/payment_subscription
        subscription = await this.wireTransferProvider.createSubscription(
          ...args
        );
      } else {
        subscription = await this.paymentProvider.createSubscription(...args);
      }
<<<<<<< HEAD
      console.log('TXN IS', subscription);
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Payment processing failed: ${error.message}`);
=======
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Subscription creation failed: ${error.message}`);
>>>>>>> origin/payment_subscription
    }
  }

  /**
   * @param {keyof PaymentMethods} method
   * @param {Parameters<T['getSubscription']>} args
<<<<<<< HEAD
   * @returns
=======
   * @returns {ReturnType<T['getSubscription']>}
>>>>>>> origin/payment_subscription
   */
  async getSubscription(method, ...args) {
    try {
      let subscription;
      if (method === PaymentMethods.WIRE_TRANSFER) {
        subscription = await this.wireTransferProvider.getUserSubscription(
          args[0]
        );
      } else {
        subscription = await this.paymentProvider.getSubscription(...args);
      }
<<<<<<< HEAD
      console.log('TXN IS', subscription);
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Payment processing failed: ${error.message}`);
=======
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Fetching subscription failed: ${error.message}`);
>>>>>>> origin/payment_subscription
    }
  }

  /**
   *
   * @param {string} id
   * @returns
   */
  async getPaymentStatus(id) {
    try {
      const payment = await this.paymentProvider.getPaymentStatus(id);
      return payment;
    } catch (error) {
      throw new Error(`Payment status fetch failed: ${error.message}`);
    }
  }

  /**
   *
   * @param {keyof PaymentMethods} method
   * @param {string} id
<<<<<<< HEAD
   * @returns
=======
   * @returns {ReturnType<T['cancelSubscription']>}
>>>>>>> origin/payment_subscription
   */
  async cancelSubscription(method, id) {
    try {
      let subscription;
      if (method === PaymentMethods.WIRE_TRANSFER) {
        subscription = await this.wireTransferProvider.cancelSubscription(id);
      } else {
        subscription = await this.paymentProvider.cancelSubscription(id);
      }
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Subscription cancellation failed: ${error.message}`);
    }
  }

  /**
   *
   * @param  {Parameters<T['handleCallback']>} args
<<<<<<< HEAD
   * @returns
   */
  async handleCallback(...args) {
    let t = await this.paymentProvider.handleCallback(...args);
    return t;
=======
   * @returns {ReturnType<T['handleCallback']>}
   */
  async handleCallback(...args) {
    let result = await this.paymentProvider.handleCallback(...args);
    return result;
>>>>>>> origin/payment_subscription
  }
}

module.exports = PaymentProviderFactory;
