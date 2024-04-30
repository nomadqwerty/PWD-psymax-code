const { configDotenv } = require('dotenv');
const PaymentProviderFactory = require('./factory');
const GoCardlessProvider = require('../providers/go-cardless');

configDotenv();
const createPaymentService = () => {
  const goCardlessProvider = new GoCardlessProvider(process.env.GC_API_KEY);
  return new PaymentProviderFactory(goCardlessProvider);
};

module.exports = createPaymentService;
