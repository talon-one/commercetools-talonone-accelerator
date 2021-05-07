'use strict';

/**
 * @readonly
 * @enum {number}
 */
const LoggerMode = Object.freeze({
  NONE: 0,
  ERROR: 1,
  INFO: 2,
  TEST: 3,
  DEBUG: 4,
});

module.exports = { LoggerMode };
