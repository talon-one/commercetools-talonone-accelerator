'use strict';

/**
 * @readonly
 * @enum {number}
 */
const EventType = Object.freeze({
  CART: 1,
  CUSTOMER: 2,
  ORDER: 3,
  UNKNOWN: 0,

  isValid(value) {
    return value >= 0 && value <= 3;
  },
});

module.exports = { EventType };
