module.exports = Object.freeze({
  SOME_32BYTE_BASE64_STRING: '',
  SOME_64BYTE_BASE64_STRING:
    '',
  EmailHost: '',
  EmailPort: 587,
  EmailUser: '',
  EmailPassword: '',
  EmailFrom: '',
  TimeForPasswordExpire: 30,
  TimeForTokenExpire: 3600, // 1 hr = 3600 seconds
  TokenExpiration: '1h',
  PAGINATION_LIMIT: 10,
  GLOBAL_POINT_VALUE: 0.0582873,
  SubscriptionPlans: Object.freeze({
    GLOBAL: 'GLOBAL',
    GLOBAL_EXTENDED: 'GLOBAL_EXTENDED',
  }),
  PaymentMethods: Object.freeze({
    DIRECT_DEBIT: 'DIRECT_DEBIT',
    WIRE_TRANSFER: 'WIRE_TRANSFER',
  }),
  SubscriptionStatusTracking: Object.freeze({
    TRIAL: 'TRIAL',
    ENDORSED: 'ENDORSED',
    SPONSORED: 'SPONSORED',
    REWARDED: 'REWARDED',
    SUBSCRIBED: 'SUBSCRIBED',
    COMMITTED: 'COMMITTED',
    INACTIVE: 'INACTIVE',
  }),
});

