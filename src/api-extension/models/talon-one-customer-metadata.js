'use strict';
const { Env } = require('./env');

/**
 * @readonly
 * @enum {string}
 */
const TalonOneCustomerMetadata = Object.freeze({
  key: Env.getCtpCustomerMetadataTypeKey(),
  referralCodesFieldName: 'talon_one_customer_referral_codes',
  loyaltyPointsFieldName: 'talon_one_customer_loyalty_points',
});

module.exports = { TalonOneCustomerMetadata };
