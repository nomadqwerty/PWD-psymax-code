const { PaymentMethods } = require('../../utils/constants');
const { WireTransferProvider } = require('../queues/wire-transfer');

const PaymentProvider = require('../providers/base').default;

/**
 * Creates a new provider, providers must be PCI compliant and use 3-D Secure Auth
 *
 * @template {PaymentProvider} T
 */
class PaymentProviderFactory {
  /**
   * @param {T} paymentProvider
   * @param {WireTransferProvider} wireTransferProvider
   */
  constructor(paymentProvider, wireTransferProvider) {
    this.paymentProvider = paymentProvider;
    this.wireTransferProvider = wireTransferProvider;
  }

  /**
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
    }
  }

  /**
   * @param {keyof PaymentMethods} method
   * @param {Parameters<T['processPayment']>} args
   * @returns
   */
  async createSubscription(method, ...args) {
    try {
      let subscription;
      if (method === PaymentMethods.WIRE_TRANSFER) {
        console.log('Wire is: ', args);
        subscription = await this.wireTransferProvider.createSubscription(
          ...args
        );
      } else {
        subscription = await this.paymentProvider.createSubscription(...args);
      }
      console.log('TXN IS', subscription);
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  /**
   * @param {keyof PaymentMethods} method
   * @param {Parameters<T['getSubscription']>} args
   * @returns
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
      console.log('TXN IS', subscription);
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Payment processing failed: ${error.message}`);
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
   * @returns
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
   * @returns
   */
  async handleCallback(...args) {
    let t = await this.paymentProvider.handleCallback(...args);
    return t;
  }
}

module.exports = PaymentProviderFactory;
