'use strict';
const schema = require('../schemas/cart-event.schema.json');
const { Validator } = require('./validator');

class CartEventValidator {
  /**
   * @param {Object} event
   * @returns {boolean}
   */
  static validate(event) {
    return Validator.validate(schema, event);
  }
}

module.exports = { CartEventValidator };
