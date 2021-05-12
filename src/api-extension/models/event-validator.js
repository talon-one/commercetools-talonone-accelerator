'use strict';

class EventValidator {
  /**
   * @param {Object} event
   * @returns {boolean}
   */
  static validate(event) {
    throw new Error(`Not implemented (${event}).`);
  }
}

module.exports = { EventValidator };
