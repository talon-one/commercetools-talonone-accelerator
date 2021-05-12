'use strict';

/**
 * @readonly
 * @enum {number}
 */
const EventValidationMode = Object.freeze({
  SIMPLE: 1,
  JSON_SCHEMA: 2,

  isValid(value) {
    return value >= 1 && value <= 2;
  },
});

module.exports = { EventValidationMode };
