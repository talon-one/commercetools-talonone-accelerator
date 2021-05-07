'use strict';
const Ajv = require('ajv').default;

class Validator {
  /**
   * @param {Object} schema
   * @param {any} value
   * @returns {boolean}
   */
  static validate(schema, value) {
    const ajv = new Ajv({ allowUnionTypes: true });
    const validate = ajv.compile(schema);

    return validate(value);
  }
}

module.exports = { Validator };
