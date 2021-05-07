'use strict';
const { LoggerMode } = require('../models/logger-mode');

class LoggerService {
  /**
   * @param {string|null} mode
   */
  constructor(mode = null) {
    const { instance } = this.constructor;

    if (instance) {
      return instance;
    }

    if (!LoggerService.checkMode(mode)) {
      throw new Error('Unsupported mode.');
    }

    this.mode = LoggerMode[mode];
    this.lastError = null;
    this.constructor.instance = this;
  }

  /**
   * @param {string} mode
   * @returns {boolean}
   */
  static checkMode(mode) {
    return LoggerMode[mode] >= 0;
  }

  /**
   * @param data
   * @param {boolean} stringify
   * @returns {LoggerService}
   */
  info(data, stringify = false) {
    this._display(LoggerMode.INFO, data, stringify);

    return this;
  }

  /**
   * @param data
   * @param {boolean} stringify
   * @returns {LoggerService}
   */
  test(data, stringify = false) {
    this._display(LoggerMode.TEST, data, stringify);

    return this;
  }

  /**
   * @param data
   * @param {boolean} stringify
   * @returns {LoggerService}
   */
  debug(data, stringify = false) {
    this._display(LoggerMode.DEBUG, data, stringify);

    return this;
  }

  /**
   * @param data
   * @param {boolean} stringify
   * @returns {LoggerService}
   */
  error(data, stringify = false) {
    this._display(LoggerMode.ERROR, data, stringify, 'error');
    this.lastError = data;

    return this;
  }

  /**
   * @returns {any}
   */
  getLastError() {
    return this.lastError;
  }

  /**
   * @param mode
   * @param data
   * @param {boolean} stringify
   * @param type
   * @private
   */
  _display(mode, data, stringify, type = 'log') {
    if (this.mode >= mode) {
      console[type](stringify ? JSON.stringify(data) : data);
    }
  }
}

module.exports = { LoggerService };
