'use strict';
const { UpdateAction } = require('./update-action');

/**
 * @see https://docs.commercetools.com/api/projects/carts#remove-customlineitem
 */
class RemoveCustomLineItemBuilder {
  constructor() {
    this.action = {
      action: UpdateAction.removeCustomLineItem,
    };
  }

  /**
   * @param customLineItemId
   * @returns {RemoveCustomLineItemBuilder}
   */
  customLineItemId(customLineItemId) {
    this.action.customLineItemId = customLineItemId;

    return this;
  }

  /**
   * @returns {Object}
   */
  build() {
    return this.action;
  }
}

module.exports = { RemoveCustomLineItemBuilder };
