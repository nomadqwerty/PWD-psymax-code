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
<<<<<<< HEAD
   * Process Payment
=======
   * Create one time payment
>>>>>>> origin/payment_subscription
   * @abstract
   * @param {...any} args
   * @returns {Promise<any>}
   */
<<<<<<< HEAD
  async processPayment(...args) {}

  /**
   * Process Payment
=======
  async createPayment(...args) {}

  /**
   * Create new customer subscription
>>>>>>> origin/payment_subscription
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
<<<<<<< HEAD
   * @abstract
   * @param {...any} args Get status of a payment
=======
   * Get status of a payment
   * @abstract
   * @param {...any} args
>>>>>>> origin/payment_subscription
   * @returns {any}
   */
  async getPaymentStatus(...args) {}

  /**
<<<<<<< HEAD
   * @abstract
   * @param {...any} args Cancels an existing subscription
=======
   * Cancels an existing subscription
   * @abstract
   * @param {...any} args
>>>>>>> origin/payment_subscription
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
