'use strict';
const { Env } = require('./env');

/**
 * @readonly
 * @enum {string}
 */
const TalonOneCartMetadata = Object.freeze({
  key: Env.getCtpCartMetadataTypeKey(),
  notificationsFieldName: 'talon_one_cart_notifications',
  referralCodesFieldName: 'talon_one_cart_referral_code',
  payWithPointsFieldName: 'talon_one_cart_pay_with_points',
  couponCode: 'talon_one_cart_coupon_code_action_value',
  couponCodeAction: 'talon_one_cart_coupon_code_action',
  applyCoupon: 'apply',
  removeCoupon: 'remove',
});

module.exports = { TalonOneCartMetadata };
