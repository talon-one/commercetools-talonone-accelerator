'use strict';

const DEFAULT_TYPE = 'string';

class DataMapper {
  /**
   * @param {string} spec
   * @param {LoggerService} logger
   */
  constructor(spec, logger) {
    this.spec = this._prepareSpec(spec);
    this.logger = logger;
  }

  /**
   * @param {any} obj
   */
  process(obj) {
    if (!obj || !(typeof obj === 'object')) {
      return null;
    }
    try {
      for (const k of Object.keys(obj)) {
        if (this.spec.fields.includes(k)) {
          const result = {};

          this.spec.transormations.forEach((tr) => {
            try {
              result[tr.dstName] = this._parseSource(
                // eslint-disable-next-line no-confusing-arrow
                tr.srcPath.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), obj),
                tr.dstType,
                tr.srcAllowedFields
              );
            } catch (e) {
              //
            }
          });

          return result;
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
    return null;
  }

  /**
   * @see Data Mapping Specification
   * @param {string} spec
   * @returns {{fields, transormations}}
   * @private
   */
  _prepareSpec(spec) {
    const data = spec.replace(/\s/g, '').split(';');
    const fields = data
      .map((v) => v.replace(/^([^.:]*).*$/, '$1'))
      .filter((v, i, a) => a.indexOf(v) === i);

    const transormations = data.map((v) => {
      const [src, dst] = v.split(':');
      const srcFilter = src.replace(/^.*{(.*)}.*$/, '$1');
      const srcPath = src.split('.');
      let srcAllowedFields = [];

      const lastKey = srcPath.length - 1;
      srcPath[lastKey] = srcPath[lastKey].replace(`{${srcFilter}}`, '');

      let dstType = dst.replace(/^.*{(.*)}.*$/, '$1');
      const dstName = dst.replace(`{${dstType}}`, '');

      if (!dstType.length || dstType === dstName) {
        dstType = DEFAULT_TYPE;
      }

      if (srcFilter !== src) {
        srcAllowedFields = srcFilter.split(',');
      }

      return {
        srcPath,
        srcAllowedFields,
        dstName,
        dstType,
      };
    });

    return {
      fields,
      transormations,
    };
  }

  /**
   * @param {any} value
   * @returns {string}
   * @private
   */
  _stringDestination(value) {
    let result = String(value);

    try {
      if (typeof value === 'object' && value !== null) {
        result = JSON.stringify(value);
      }
    } catch (e) {
      //
    }

    return result;
  }

  /**
   * @param {any} value
   * @returns {boolean}
   * @private
   */
  _booleanDestination(value) {
    return !!value;
  }

  /**
   * @param {any} value
   * @returns {string|null}
   * @private
   */
  _timeDestination(value) {
    try {
      return new Date(value).toISOString();
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {any} value
   * @returns {{format, object}|null}
   * @private
   */
  _locationDestination(value) {
    let result = null;
    const values = Object.values(value);

    if (typeof value === 'object' && value !== null && values.length > 1) {
      const [x, y] = values;

      result = {
        format: 'point',
        object: `${this._numberDestination(x)}, ${this._numberDestination(y)}`,
      };
    }

    return result;
  }

  /**
   * @param {any} value
   * @returns {null|number}
   * @private
   */
  _numberDestination(value) {
    const result = Number(value);

    if (isNaN(result)) {
      return null;
    }

    return result;
  }

  /**
   * @param {any} value
   * @param {any[]} allowedFields
   * @returns {string[]}
   * @private
   */
  _datesDestination(value, allowedFields) {
    return this._parseCollection(value, allowedFields, '_timeDestination');
  }

  /**
   * @param {any} value
   * @param {any[]} allowedFields
   * @returns {{format, object}[]}
   * @private
   */
  _locationsDestination(value, allowedFields) {
    return this._parseCollection(value, allowedFields, '_locationDestination');
  }

  /**
   * @param {any} value
   * @param {any[]} allowedFields
   * @returns {string[]}
   * @private
   */
  _stringsDestination(value, allowedFields) {
    return this._parseCollection(value, allowedFields, '_stringDestination');
  }

  /**
   * @param {any} value
   * @param {any[]} allowedFields
   * @returns {number[]}
   * @private
   */
  _numbersDestination(value, allowedFields) {
    return this._parseCollection(value, allowedFields, '_numberDestination');
  }

  /**
   * @param {any} value
   * @param {any[]} allowedFields
   * @param {string} fnName
   * @returns {any[]}
   * @private
   */
  _parseCollection(value, allowedFields, fnName) {
    const result = [];
    const push = (v) => result.push(this[fnName](v));

    if (Array.isArray(allowedFields) && allowedFields.length) {
      allowedFields.forEach((k) => {
        push(value[k]);
      });
    } else {
      Object.values(value).forEach((v) => {
        push(v);
      });
    }

    const filteredResult = result.filter((val) => val);

    if (!filteredResult.length) {
      return null;
    }

    return filteredResult;
  }

  /**
   * @param {any} src
   * @param {string} type
   * @param {any[]} allowedFields
   * @returns {any}
   * @private
   */
  _parseSource(src, type, allowedFields) {
    const fn = `_${type}Destination`;

    if (typeof this[fn] === 'function') {
      return this[fn](src, allowedFields);
    }

    throw new Error('Invalid destination type.');
  }
}

module.exports = { DataMapper, DEFAULT_TYPE };
