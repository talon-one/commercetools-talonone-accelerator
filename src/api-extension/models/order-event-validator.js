'use strict';
const schema = require('../schemas/order-event.schema.json');
const { Validator } = require('./validator');

class OrderEventValidator {
  /**
   * @param {Object} event
   * @returns {boolean}
   */
  static validate(event) {
    return Validator.validate(schema, event);
  }
}

module.exports = { OrderEventValidator };
