'use strict';
// eslint-disable-next-line no-unused-vars
const { NewCustomerProfile, NewCustomerSessionV2 } = require('talon_one');

class BroadcastApiClient {
  /**
   * @param {ApiClientService[]} apiClients
   */
  constructor(apiClients) {
    this._apiClients = apiClients;
  }

  /**
   * @param {string} id
   * @param {NewCustomerProfile} payload
   * @returns {Promise<[]>}
   */
  async updateCustomerProfile(id, payload) {
    return this._promises((client) => client.updateCustomerProfile(id, payload));
  }

  /**
   * @param payload
   * @returns {Promise<[]>}
   */
  async updateCustomerProfiles(payload) {
    return this._promises((client) => client.updateCustomerProfiles(payload));
  }

  /**
   * @param {string} id
   * @param {NewCustomerSessionV2} payload
   * @returns {Promise<[]>}
   */
  async updateCustomerSession(id, payload) {
    return this._promises((client) => client.updateCustomerSession(id, payload));
  }

  /**
   * @param {function} fn
   * @returns {Promise<[]>}
   * @private
   */
  async _promises(fn) {
    const promises = [];
    this._apiClients.forEach((client) => promises.push(fn(client)));

    return Promise.all(promises);
  }
}

module.exports = { BroadcastApiClient };
