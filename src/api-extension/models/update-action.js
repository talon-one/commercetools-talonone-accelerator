'use strict';
/**
 * @see https://docs.commercetools.com/api/projects/carts#update-actions
 * @readonly
 * @enum {string}
 */
const UpdateAction = Object.freeze({
  /**
   * @see https://docs.commercetools.com/api/projects/carts#add-customlineitem
   */
  addCustomLineItem: 'addCustomLineItem',
  /**
   * @see https://docs.commercetools.com/api/projects/carts#remove-customlineitem
   */
  removeCustomLineItem: 'removeCustomLineItem',
  /**
   * @see https://docs.commercetools.com/api/projects/carts#add-lineitem
   */
  addLineItem: 'addLineItem',
  /**
   * @see https://docs.commercetools.com/api/projects/carts#change-lineitem-quantity
   */
  changeLineItemQuantity: 'changeLineItemQuantity',
  /**
   * @see https://docs.commercetools.com/api/projects/carts#set-custom-type
   */
  setCustomType: 'setCustomType',
  /**
   * @see https://docs.commercetools.com/api/projects/carts#set-lineitem-totalprice
   */
  setLineItemTotalPrice: 'setLineItemTotalPrice',
});

module.exports = { UpdateAction };
