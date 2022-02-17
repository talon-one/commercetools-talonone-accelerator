'use strict';
const { LoyaltyPoints } = require('./loyalty-points');
const { SetCustomTypeBuilder } = require('./set-custom-type-builder');
const { EffectType } = require('./effect-type');
const { TalonOneCustomerMetadata } = require('./talon-one-customer-metadata');

const REFERRAL_CODE_SEPARATOR = '__';
const REFERRAL_CREATED_PIPE = '_referralCreated';

/**
 * Creates Customer Update Actions based on Talon.One effects and customer events from commercetools.
 * @see https://docs.commercetools.com/api/projects/customers#update-actions
 */
class CustomerActionFactory {
  /**
   * @param {CtpCustomerCustomFields} customFields
   */
  constructor(customFields) {
    this._customFields = customFields;
  }

  /**
   * @param {any[]} effects
   * @param {any[]} [actions=[]]
   * @param {string[]} [pipes=[REFERRAL_CREATED_PIPE]]
   * @return {Promise<any[]>}
   */
  async createActions(effects, actions = [], pipes = [REFERRAL_CREATED_PIPE]) {
    if (!effects || !effects.length) {
      return actions;
    }

    for (const pipe of pipes) {
      const fn = this[pipe].bind(this);
      actions = await fn(effects, actions);
    }

    return actions;
  }

  /**
   * @param {any[]} effects
   * @param {any[]} actions
   * @return {any[]}
   * @private
   */
  _referralCreated(effects, actions) {
    const referralCodes = {};

    for (const effect of effects) {
      if (effect?.effectType === EffectType.referralCreated) {
        const name = effect.ruleName;
        const code = `${effect.fromApi}${REFERRAL_CODE_SEPARATOR}${effect.props.value}`;

        if (referralCodes[name]) {
          referralCodes[name].codes.push(code);
        } else {
          referralCodes[name] = {
            codes: [code],
          };
        }
      }
    }

    const builder = new SetCustomTypeBuilder(this._customFields?.fields ?? {});
    builder.customerType();

    if (this._customFields?.fields?.[TalonOneCustomerMetadata.loyaltyPointsFieldName]) {
      try {
        builder.loyaltyPoints(
          JSON.parse(
            this._customFields.fields[TalonOneCustomerMetadata.loyaltyPointsFieldName]
          ).map(
            ({ id, name, title, balance, currency }) =>
              new LoyaltyPoints(id, name, title, balance, currency)
          )
        );
      } catch (e) {
        //
      }
    }

    if (this._customFields?.fields?.[TalonOneCustomerMetadata.referralCodesFieldName]) {
      builder.referrals(this._customFields.fields[TalonOneCustomerMetadata.referralCodesFieldName]);
    }

    for (const referralCode of Object.values(referralCodes)) {
      builder.addReferral(referralCode.codes.join(REFERRAL_CODE_SEPARATOR));
    }

    if (builder.hasReferrals() || builder.hasLoyaltyPoints()) {
      return [...actions, builder.build()];
    }

    return actions;
  }
}

module.exports = { CustomerActionFactory, REFERRAL_CODE_SEPARATOR, REFERRAL_CREATED_PIPE };
