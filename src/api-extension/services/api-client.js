'use strict';
const {
  // eslint-disable-next-line no-unused-vars
  NewCustomerProfile,
  // eslint-disable-next-line no-unused-vars
  NewCustomerSessionV2,
  IntegrationRequest,
  ApiClient,
  IntegrationApi,
} = require('talon_one');

class ApiClientService {
  /**
   * @param {string} basePath
   * @param {string} apiKey
   * @param {string} currencyCode
   */
  constructor(basePath, apiKey, currencyCode) {
    const instance = this.constructor.instance?.[apiKey];

    if (instance) {
      return instance;
    }

    this.currencyCode = currencyCode;

    const apiClient = new ApiClient();
    apiClient.basePath = basePath;

    const apiKeyV1 = apiClient.authentications.api_key_v1;
    apiKeyV1.apiKey = apiKey;
    apiKeyV1.apiKeyPrefix = 'ApiKey-v1';

    if (!this.constructor.instance) {
      this.constructor.instance = {};
    }

    this.client = new IntegrationApi(apiClient);
    this.constructor.instance[apiKey] = this;
  }

  /**
   * @param {string} id
   * @param {NewCustomerProfile} payload
   * @returns {Promise<any>}
   */
  async updateCustomerProfile(id, payload) {
    return this.client
      .updateCustomerProfileV2(id, payload, {
        runRuleEngine: true,
      })
      .then(this._projection.bind(this));
  }

  /**
   * @param payload
   *
   * @return {Promise<any>}
   */
  async updateCustomerProfiles(payload) {
    return this.client.updateCustomerProfilesV2(payload).then(this._projection.bind(this));
  }

  /**
   * @param {string} id
   * @param {NewCustomerSessionV2} payload
   * @returns {Promise<any>}
   */
  async updateCustomerSession(id, payload) {
    const integrationRequest = new IntegrationRequest(payload);

    integrationRequest.responseContent = [IntegrationRequest.ResponseContentEnum.customerSession];

    return this.client
      .updateCustomerSessionV2(id, integrationRequest)
      .then(this._projection.bind(this));
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

module.exports = { ApiClientService };
