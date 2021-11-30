'use strict';
const { LoyaltyPoints } = require('./loyalty-points');
const { UpdateAction } = require('./update-action');
const { Notification } = require('./notification');
const { TalonOneCartMetadata } = require('./talon-one-cart-metadata');
const { TalonOneCustomerMetadata } = require('./talon-one-customer-metadata');
const { TalonOneLineItemMetadata } = require('./talon-one-line-item-metadata');

const filter = (k) => k.substr(k.length - 9) === 'FieldName';

const DISALLOWED_METADATA_FIELD_KEYS = [
  ...Object.keys(TalonOneCartMetadata).filter(filter),
  ...Object.keys(TalonOneCustomerMetadata).filter(filter),
  ...Object.keys(TalonOneLineItemMetadata).filter(filter),
];

const mapper = (k) => DISALLOWED_METADATA_FIELD_KEYS[k];
const DISALLOWED_METADATA_FIELDS = DISALLOWED_METADATA_FIELD_KEYS.map(mapper);

class SetCustomTypeBuilder {
  constructor(initialFields = {}) {
    this.action = {
      action: UpdateAction.setCustomType,
      fields: SetCustomTypeBuilder.prepareInitialFields(initialFields),
    };

    this._notifications = [];
    this._referrals = [];
    this._loyaltyPoints = [];
  }

  static prepareInitialFields(initialFields = {}) {
    const fields = {};
    const keys = Object.keys(initialFields);

    for (const key of keys) {
      if (!DISALLOWED_METADATA_FIELDS.includes(key)) {
        fields[key] = initialFields[key];
      }
    }

    return fields;
  }

  /**
   * @param {boolean} payWithPoints
   * @return {SetCustomTypeBuilder}
   */
  payWithPoints(payWithPoints) {
    this._addField(TalonOneCartMetadata.payWithPointsFieldName, !!payWithPoints);

    return this;
  }

  /**
   * @param {string} referralCode
   * @return {SetCustomTypeBuilder}
   */
  referralCode(referralCode) {
    this._addField(TalonOneCartMetadata.referralCodesFieldName, referralCode);

    return this;
  }

  /**
   * @return {SetCustomTypeBuilder}
   */
  removeReferralCode() {
    return this.referralCode('');
  }

  /**
   * @return {SetCustomTypeBuilder}
   */
  cartType() {
    this.action.type = {
      key: TalonOneCartMetadata.key,
    };

    return this;
  }

  /**
   * @return {SetCustomTypeBuilder}
   */
  customerType() {
    this.action.type = {
      key: TalonOneCustomerMetadata.key,
    };

    return this;
  }

  /**
   * @param {Notification[]} notifications
   * @return {SetCustomTypeBuilder}
   */
  notifications(notifications) {
    for (const notification of notifications) {
      this.addNotification(notification);
    }
    return this;
  }

  /**
   * @param {Notification} notification
   * @return {SetCustomTypeBuilder}
   */
  addNotification(notification) {
    if (!(notification instanceof Notification)) {
      throw new Error('Invalid notification type.');
    }

    this._notifications.push(notification.toObject());

    return this;
  }

  /**
   * @return {boolean}
   */
  hasNotifications() {
    return !!this._notifications.length;
  }

  /**
   * @return {SetCustomTypeBuilder}
   * @private
   */
  _buildNotifications() {
    if (!this.hasNotifications()) {
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
   * @param {LoyaltyPoints[]} loyaltyPoints
   * @return {SetCustomTypeBuilder}
   */
  loyaltyPoints(loyaltyPoints) {
    for (const points of loyaltyPoints) {
      this.addLoyaltyPoints(points);
    }
    return this;
  }

  /**
   * @param {LoyaltyPoints} loyaltyPoints
   * @return {SetCustomTypeBuilder}
   */
  addLoyaltyPoints(loyaltyPoints) {
    if (!(loyaltyPoints instanceof LoyaltyPoints)) {
      throw new Error('Invalid loyaltyPoints type.');
    }

    this._loyaltyPoints.push(loyaltyPoints.toObject());

    return this;
  }

  /**
   * @return {SetCustomTypeBuilder}
   * @private
   */
  _buildLoyaltyPoints() {
    if (!this.hasLoyaltyPoints()) {
      return this;
    }

    this.customerType();
    this._addField(
      TalonOneCustomerMetadata.loyaltyPointsFieldName,
      JSON.stringify(this._loyaltyPoints)
    );

    return this;
  }

  /**
   * @param {string[]} referrals
   * @return {SetCustomTypeBuilder}
   */
  referrals(referrals) {
    for (const referral of referrals) {
      this.addReferral(referral);
    }

    return this;
  }

  /**
   * @param {string} referral
   * @return {SetCustomTypeBuilder}
   */
  addReferral(referral) {
    this._referrals.push(referral);

    return this;
  }

  /**
   * @return {SetCustomTypeBuilder}
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
   * @return {boolean}
   */
  hasReferrals() {
    return !!this._referrals.length;
  }

  /**
   * @return {boolean}
   */
  hasLoyaltyPoints() {
    return !!this._loyaltyPoints.length;
  }

  /**
   * @param {Object} fields
   * @return {SetCustomTypeBuilder}
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
   * @return {Object}
   */
  build() {
    this._buildNotifications();
    this._buildReferrals();
    this._buildLoyaltyPoints();

    if (!Object.keys(this.action.fields).length) {
      delete this.action.fields;
    }

    return this.action;
  }
}

module.exports = { SetCustomTypeBuilder };
