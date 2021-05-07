'use strict';
const schema = require('../schemas/customer-event.schema.json');
const { Validator } = require('./validator');

class CustomerEventValidator {
  /**
   * @param {Object} event
   * @returns {boolean}
   */
  static validate(event) {
    return Validator.validate(schema, event);
  }
}

module.exports = { CustomerEventValidator };
