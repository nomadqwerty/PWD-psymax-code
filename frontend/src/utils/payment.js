const SubscriptionPlans = Object.freeze({
  GLOBAL: 'GLOBAL',
  GLOBAL_EXTENDED: 'GLOBAL_EXTENDED',
});

const PaymentMethods = Object.freeze({
  DIRECT_DEBIT: 'DIRECT_DEBIT',
  WIRE_TRANSFER: 'WIRE_TRANSFER',
});

const Pricing = Object.freeze({
  globalPricing_noVat: +process.env.NEXT_PUBLIC_PRICING_GLOBAL,
  globalExtendedPricing_noVat: +process.env.NEXT_PUBLIC_PRICING_GLOBAL_EXTENDED,
  vatPercentage: +process.env.NEXT_PUBLIC_PRICING_VAT_PERCENTAGE / 100,
});

/**
 *
 * @param {keyof SubscriptionPlans} plan
 */
function getPlanInfo(plan) {
  return {
    [SubscriptionPlans.GLOBAL]: {
      pricing_noVat: Pricing.globalPricing_noVat,
      vatPercentage: Pricing.vatPercentage,
      name: 'Global',
    },
    [SubscriptionPlans.GLOBAL_EXTENDED]: {
      pricing_noVat: Pricing.globalExtendedPricing_noVat,
      vatPercentage: Pricing.vatPercentage,
      name: 'Global Extended',
    },
  }[plan];
}

const DAYS_PER_CYCLE = 28;

function cyclesToDays(cycles) {
  return cycles * DAYS_PER_CYCLE;
}

export {
  getPlanInfo,
  PaymentMethods,
  SubscriptionPlans,
  DAYS_PER_CYCLE,
  cyclesToDays,
};
