'use strict';
const { SetCustomTypeBuilder } = require('./set-custom-type-builder');
const { EffectType } = require('./effect-type');

const REFERRAL_CODE_SEPARATOR = '__';
const REFERRAL_CREATED_PIPE = '_referralCreated';

/**
 * Creates Customer Update Actions based on Talon.One effects and customer events from Commercetools.
 * @see https://docs.commercetools.com/api/projects/customers#update-actions
 */
class CustomerActionFactory {
  /**
   * @param {CtpCustomerCustomFields} customFields
   */
  constructor(customFields) {
    this.customFields = customFields;
  }

  /**
   * @param {any[]} effects
   * @param {any[]} [actions=[]]
   * @param {string[]} pipes
   * @returns {Promise<any[]>}
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
   * @returns {any[]}
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

    const builder = new SetCustomTypeBuilder();

    if (this.customFields?.fields?.talon_one_customer_referral_codes) {
      builder.referrals(this.customFields.fields.talon_one_customer_referral_codes);
    }

    for (const referralCode of Object.values(referralCodes)) {
      builder.addReferral(referralCode.codes.join(REFERRAL_CODE_SEPARATOR));
    }

    if (builder.hasReferrals()) {
      return [...actions, builder.build()];
    }

    return actions;
  }
}

module.exports = { CustomerActionFactory, REFERRAL_CODE_SEPARATOR, REFERRAL_CREATED_PIPE };
