'use strict';

/**
 * @readonly
 * @enum {string}
 */
const EventType = Object.freeze({
  cart: 'cart',
  customer: 'customer',
  order: 'order',
  unknown: 'unknown',
});

module.exports = { EventType };
