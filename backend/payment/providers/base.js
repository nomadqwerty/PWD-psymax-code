/**
 * Provider
 * @abstract
 */
class PaymentProvider {
  /**
   * @type {string}
   */
  baseCurrency;
  /**
   * Create one time payment
   * @abstract
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async createPayment(...args) {}

  /**
   * Create new customer subscription
   * @abstract
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async createSubscription(...args) {}

  /**
   * Get Subscription
   * @abstract
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async getSubscription(...args) {}

  /**
   * Get status of a payment
   * @abstract
   * @param {...any} args
   * @returns {any}
   */
  async getPaymentStatus(...args) {}

  /**
   * Cancels an existing subscription
   * @abstract
   * @param {...any} args
   * @returns {any}
   */
  async cancelSubscription(...args) {}

  /**
   * Handle webhook callback
   * @abstract
   * @param {...any} args
   * @returns {any}
   */
  async handleCallback(...args) {}
}

class ProviderCallbackError extends Error {
  /**
   * @type {number}
   */
  statusCode;

  /**
   *
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ProviderCallbackError.prototype);
  }
}

module.exports.default = PaymentProvider;
module.exports.ProviderCallbackError = ProviderCallbackError;
