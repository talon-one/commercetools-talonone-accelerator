'use strict';
const { updateCustomerProfileResponse, updateCustomerSessionResponse } = require('../mocks');

class ApiClientMockService {
  constructor(basePath, apiKey, currencyCode) {
    const instance = this.constructor.instance?.[apiKey];

    if (instance) {
      return instance;
    }

    this.basePath = basePath;
    this.apiKey = apiKey;
    this.currencyCode = currencyCode;

    if (!this.constructor.instance) {
      this.constructor.instance = {};
    }

    this.constructor.instance[apiKey] = this;
  }

  async updateCustomerProfile(id, payload) {
    this.id = id;
    this.payload = payload;

    return this._projection(
      process.env[`PROFILE_${this.apiKey}_MOCK`] ||
        process.env.CUSTOMER_PROFILE_MOCK ||
        updateCustomerProfileResponse
    );
  }

  async updateCustomerSession(id, payload) {
    this.id = id;
    this.payload = payload;

    return this._projection(
      process.env[`SESSION_${this.apiKey}_MOCK`] ||
        process.env.CUSTOMER_SESSION_MOCK ||
        updateCustomerSessionResponse
    );
  }

  /**
   * @param {any} data
   * @returns {any}
   * @private
   */
  _projection(data) {
    if (data) {
      data.fromApi = this.currencyCode;
    }
    return data;
  }
}

module.exports = { ApiClientMockService };
