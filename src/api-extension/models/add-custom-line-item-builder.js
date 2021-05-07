'use strict';
const { UpdateAction } = require('./update-action');
const { TalonOneLineItemMetadata } = require('./talon-one-line-item-metadata');

class AddCustomLineItemBuilder {
  constructor() {
    this.action = {
      action: UpdateAction.addCustomLineItem,
    };
  }

  /**
   * @param lang
   * @param name
   * @returns {AddCustomLineItemBuilder}
   */
  name(lang, name) {
    this.action.name = {
      [lang]: name,
    };

    return this;
  }

  /**
   * @param slug
   * @returns {AddCustomLineItemBuilder}
   */
  slug(slug) {
    this.action.slug = slug;

    return this;
  }

  /**
   * @param id
   * @returns {AddCustomLineItemBuilder}
   */
  taxCategory(id) {
    this.action.taxCategory = {
      typeId: 'tax-category',
      id,
    };

    return this;
  }

  /**
   * @param {string} effectName
   * @param {string|null} couponCode
   * @returns {AddCustomLineItemBuilder}
   */
  effectMetadata(effectName, couponCode = null) {
    this.action.custom = {
      type: {
        key: TalonOneLineItemMetadata.key,
      },
      fields: {
        [TalonOneLineItemMetadata.effectFieldName]: effectName,
      },
    };

    if (couponCode) {
      this.action.custom.fields[TalonOneLineItemMetadata.couponCodeFieldName] = couponCode;
    }

    return this;
  }

  /**
   * @param centAmount
   * @param currencyCode
   * @param fractionDigits
   * @returns {AddCustomLineItemBuilder}
   */
  price(centAmount, currencyCode, fractionDigits = 2) {
    this.action.money = {
      type: 'centPrecision',
      currencyCode,
      centAmount,
      fractionDigits,
    };

    return this;
  }

  /**
   * @returns {Object}
   */
  build() {
    return this.action;
  }
}

module.exports = { AddCustomLineItemBuilder };
