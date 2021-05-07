'use strict';
const { UpdateAction } = require('./update-action');

class SetLineItemTotalPriceBuilder {
  constructor() {
    this.action = {
      action: UpdateAction.setLineItemTotalPrice,
      externalTotalPrice: {},
    };
  }

  /**
   * @param {string} lineItemId
   * @returns {SetLineItemTotalPriceBuilder}
   */
  lineItemId(lineItemId) {
    this.action.lineItemId = lineItemId;

    return this;
  }

  /**
   * @param {number} centAmount
   * @param {string} currencyCode
   * @returns {SetLineItemTotalPriceBuilder}
   */
  price(centAmount, currencyCode) {
    this.action.externalTotalPrice.price = {
      currencyCode,
      centAmount,
    };

    return this;
  }

  /**
   * @param {number} centAmount
   * @param {string} currencyCode
   * @returns {SetLineItemTotalPriceBuilder}
   */
  totalPrice(centAmount, currencyCode) {
    this.action.externalTotalPrice.totalPrice = {
      currencyCode,
      centAmount,
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

module.exports = { SetLineItemTotalPriceBuilder };
