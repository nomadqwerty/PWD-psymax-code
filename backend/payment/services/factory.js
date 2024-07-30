const { PaymentMethods } = require('../../utils/constants');

/**
 * Creates a new provider, providers must be PCI compliant and use 3-D Secure Auth
 *
 * @template {import('../providers/base').default} T
 */
class PaymentProviderFactory {
  /**
   * @param {T} paymentProvider
   * @param {import('../queues/wire-transfer').WireTransferProvider} wireTransferProvider
   */
  constructor(paymentProvider, wireTransferProvider) {
    this.paymentProvider = paymentProvider;
    this.wireTransferProvider = wireTransferProvider;
  }

  /**
   * @param {Parameters<T['createPayment']>} args
   * @returns
   */
  async createPayment(...args) {
    try {
      const payment = await this.paymentProvider.createPayment(...args);
      return payment;
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  /**
   * @param {keyof PaymentMethods} method
   * @param {Parameters<T['createSubscription']>} args
   * @returns {ReturnType<T['createSubscription']>}
   */
  async createSubscription(method, ...args) {
    try {
      let subscription;
      if (method === PaymentMethods.WIRE_TRANSFER) {
        subscription = await this.wireTransferProvider.createSubscription(
          ...args
        );
      } else {
        subscription = await this.paymentProvider.createSubscription(...args);
      }
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  /**
   * @param {keyof PaymentMethods} method
   * @param {Parameters<T['getSubscription']>} args
   * @returns {ReturnType<T['getSubscription']>}
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
      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error(`Fetching subscription failed: ${error.message}`);
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
   * @returns {ReturnType<T['cancelSubscription']>}
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
   * @returns {ReturnType<T['handleCallback']>}
   */
  async handleCallback(...args) {
    let result = await this.paymentProvider.handleCallback(...args);
    return result;
  }
}

module.exports = PaymentProviderFactory;
