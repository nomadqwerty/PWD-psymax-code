const path = require('path');
const { configDotenv } = require('dotenv');

configDotenv({
  path: path.join(__dirname, './config.env'),
});

module.exports = Object.freeze({
  globalPricing_noVat: +process.env.PRICING_GLOBAL,
  globalPricing:
    +process.env.PRICING_GLOBAL * (+process.env.PRICING_VAT_PERCENTAGE / 100) +
    +process.env.PRICING_GLOBAL,
  globalExtendedPricing:
    +process.env.PRICING_GLOBAL_EXTENDED *
      (+process.env.PRICING_VAT_PERCENTAGE / 100) +
    +process.env.PRICING_GLOBAL_EXTENDED,
  globalExtendedPricing_noVat: +process.env.PRICING_GLOBAL_EXTENDED,
  vatPercentage: +process.env.PRICING_VAT_PERCENTAGE / 100,
});
