'use strict';
const { UpdateAction } = require('./update-action');
const { Notification } = require('./notification');
const { TalonOneCartMetadata } = require('./talon-one-cart-metadata');
const { TalonOneCustomerMetadata } = require('./talon-one-customer-metadata');

class SetCustomTypeBuilder {
  constructor() {
    this.action = {
      action: UpdateAction.setCustomType,
    };

    this._notifications = [];
    this._referrals = [];
  }

  /**
   * @param {string} referralCode
   * @returns {SetCustomTypeBuilder}
   */
  referralCode(referralCode) {
    this._addField(TalonOneCartMetadata.referralCodesFieldName, referralCode);

    return this;
  }

  /**
   * @returns {SetCustomTypeBuilder}
   */
  removeReferralCode() {
    return this.referralCode('');
  }

  /**
   * @returns {SetCustomTypeBuilder}
   */
  cartType() {
    this.action.type = {
      key: TalonOneCartMetadata.key,
    };

    return this;
  }

  /**
   * @returns {SetCustomTypeBuilder}
   */
  customerType() {
    this.action.type = {
      key: TalonOneCustomerMetadata.key,
    };

    return this;
  }

  /**
   * @param {Notification[]} notifications
   * @returns {SetCustomTypeBuilder}
   */
  notifications(notifications) {
    for (const notification of notifications) {
      this.addNotification(notification);
    }
    return this;
  }

  /**
   * @param {Notification} notification
   * @returns {SetCustomTypeBuilder}
   */
  addNotification(notification) {
    if (!(notification instanceof Notification)) {
      throw new Error('Invalid notification type.');
    }

    this._notifications.push(notification.toObject());

    return this;
  }

  /**
   * @returns {SetCustomTypeBuilder}
   * @private
   */
  _buildNotifications() {
    if (!this._notifications.length) {
      return this;
    }

    this.cartType();
    this._addField(
      TalonOneCartMetadata.notificationsFieldName,
      JSON.stringify(this._notifications)
    );

    return this;
  }

  /**
   * @param {string[]} referrals
   * @returns {SetCustomTypeBuilder}
   */
  referrals(referrals) {
    for (const referral of referrals) {
      this.addReferral(referral);
    }

    return this;
  }

  /**
   * @param {string} referral
   * @returns {SetCustomTypeBuilder}
   */
  addReferral(referral) {
    this._referrals.push(referral);

    return this;
  }

  /**
   * @returns {SetCustomTypeBuilder}
   * @private
   */
  _buildReferrals() {
    if (!this.hasReferrals()) {
      return this;
    }

    this.customerType();
    this._addField(TalonOneCustomerMetadata.referralCodesFieldName, this._referrals);

    return this;
  }

  /**
   * @returns {boolean}
   */
  hasReferrals() {
    return !!this._referrals.length;
  }

  /**
   * @param {Object} fields
   * @returns {SetCustomTypeBuilder}
   */
  fields(fields) {
    this.action.fields = fields;

    return this;
  }

  _addField(key, value) {
    if (!this.action.fields) {
      this.action.fields = {};
    }
    this.action.fields[key] = value;
  }

  /**
   * @returns {Object}
   */
  build() {
    this._buildNotifications();
    this._buildReferrals();

    return this.action;
  }
}

module.exports = { SetCustomTypeBuilder };
