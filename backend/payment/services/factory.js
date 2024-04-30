const PaymentProvider = require('../providers/base').default;

/**
 * Creates a new provider, providers must be PCI compliant and use 3-D Secure Auth
 *
 * @template {PaymentProvider} T
 */
class PaymentProviderFactory {
  /**
   * @param {T} paymentProvider
   */
  constructor(paymentProvider) {
    this.paymentProvider = paymentProvider;
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
   * @param {Parameters<T['processPayment']>} args
   * @returns
   */
  async createSubscription(...args) {
    try {
      const transactionId = await this.paymentProvider.createSubscription(
        ...args
      );
      console.log('TXN IS', transactionId);
      return transactionId;
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
   * @param {string} id
   * @returns
   */
  async cancelSubscription(id) {
    try {
      const payment = await this.paymentProvider.cancelSubscription(id);
      return payment;
    } catch (error) {
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
