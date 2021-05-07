'use strict';
const { UpdateAction } = require('./update-action');
const { TalonOneLineItemMetadata } = require('./talon-one-line-item-metadata');

class AddLineItemBuilder {
  constructor() {
    this.action = {
      action: UpdateAction.addLineItem,
    };
  }

  /**
   * @param sku
   * @returns {AddLineItemBuilder}
   */
  sku(sku) {
    this.action.sku = sku;

    return this;
  }

  /**
   * @param productId
   * @returns {AddLineItemBuilder}
   */
  productId(productId) {
    this.action.productId = productId;

    return this;
  }

  /**
   * @param variantId
   * @returns {AddLineItemBuilder}
   */
  variantId(variantId) {
    this.action.variantId = parseInt(variantId, 10);

    return this;
  }

  /**
   * @param {number} quantity
   * @returns {AddLineItemBuilder}
   */
  quantity(quantity) {
    this.action.quantity = quantity;

    return this;
  }

  /**
   * @param effectName
   * @returns {AddLineItemBuilder}
   */
  effectMetadata(effectName) {
    this.action.custom = {
      type: {
        key: TalonOneLineItemMetadata.key,
      },
      fields: {
        [TalonOneLineItemMetadata.effectFieldName]: effectName,
      },
    };

    return this;
  }

  /**
   * @param centAmount
   * @param currencyCode
   * @param fractionDigits
   * @returns {AddLineItemBuilder}
   */
  price(centAmount, currencyCode, fractionDigits = 2) {
    this.action.externalPrice = {
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

module.exports = { AddLineItemBuilder };
