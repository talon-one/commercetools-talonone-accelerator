'use strict';

/**
 * @readonly
 * @enum {string}
 */
const TalonOneCartMetadata = Object.freeze({
  key: 'talon_one_cart_metadata',
  notificationsFieldName: 'talon_one_cart_notifications',
  referralCodesFieldName: 'talon_one_cart_referral_code',
  couponCode: 'talon_one_cart_coupon_code_action_value',
  couponCodeAction: 'talon_one_cart_coupon_code_action',
  applyCoupon: 'apply',
  removeCoupon: 'remove',
});

module.exports = { TalonOneCartMetadata };
