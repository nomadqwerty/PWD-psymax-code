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
   * Process Payment
   * @abstract
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async processPayment(...args) {}

  /**
   * Process Payment
   * @abstract
   * @param {...any} args
   * @returns {Promise<any>}
   */
  async createSubscription(...args) {}

  /**
   * @abstract
   * @param {...any} args Get status of a payment
   * @returns {any}
   */
  async getPaymentStatus(...args) {}

  /**
   * @abstract
   * @param {...any} args Get status of a payment
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
