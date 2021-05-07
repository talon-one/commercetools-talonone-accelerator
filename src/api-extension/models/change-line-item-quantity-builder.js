'use strict';
const { UpdateAction } = require('./update-action');

/**
 * @see https://docs.commercetools.com/api/projects/carts#change-lineitem-quantity
 */
class ChangeLineItemQuantityBuilder {
  constructor() {
    this.action = {
      action: UpdateAction.changeLineItemQuantity,
    };
  }

  /**
   * @param lineItemId
   * @returns {ChangeLineItemQuantityBuilder}
   */
  lineItemId(lineItemId) {
    this.action.lineItemId = lineItemId;

    return this;
  }

  /**
   * @param quantity
   * @returns {ChangeLineItemQuantityBuilder}
   */
  quantity(quantity) {
    this.action.quantity = quantity;

    return this;
  }

  /**
   * @param centAmount
   * @param currencyCode
   * @param fractionDigits
   * @returns {ChangeLineItemQuantityBuilder}
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

module.exports = { ChangeLineItemQuantityBuilder };
