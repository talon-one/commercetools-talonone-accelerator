'use strict';

/**
 * @see https://docs.commercetools.com/api/projects/orders#orderstate
 * @readonly
 * @enum {string}
 */
const OrderState = Object.freeze({
  Open: 'Open',
  Confirmed: 'Confirmed',
  Complete: 'Complete',
  Cancelled: 'Cancelled',
});

module.exports = { OrderState };
