'use strict';

/**
 * @readonly
 * @enum {string}
 */
const EffectType = Object.freeze({
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#setdiscount
   */
  setDiscount: 'setDiscount',
  /**
   * @see: https://developers.talon.one/Integration-API/handling-effects#setdiscountperitem
   */
  setDiscountPerItem: 'setDiscountPerItem',
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#addfreeitem
   */
  addFreeItem: 'addFreeItem',
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#shownotification
   */
  showNotification: 'showNotification',
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#rejectcoupon
   */
  rejectCoupon: 'rejectCoupon',
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#acceptcoupon
   */
  acceptCoupon: 'acceptCoupon',
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#referralcreated
   */
  referralCreated: 'referralCreated',
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#rejectreferral
   */
  rejectReferral: 'rejectReferral',
  /**
   * @see https://developers.talon.one/Integration-API/handling-effects#acceptreferral
   */
  acceptReferral: 'acceptReferral',
});

module.exports = { EffectType };
