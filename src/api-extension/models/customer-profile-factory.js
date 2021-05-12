'use strict';
const { NewCustomerProfile } = require('talon_one');
const { CustomerEventMapper } = require('./customer-event-mapper');

/**
 * @typedef {Object} CustomerProfileObject
 * @property {string} id
 * @property {NewCustomerProfile} payload
 */

class CustomerProfileFactory {
  /**
   * @param {CtpCustomerEvent} event
   * @param {object} attributeMappings
   *
   * @returns {null|CustomerProfileObject}
   */
  static constructFromCustomerEvent(
    { resource: { obj } } = { resource: { obj: {} } },
    attributeMappings
  ) {
    if (attributeMappings.onlyVerifiedProfiles === true && !obj.isEmailVerified) {
      return null;
    }

    const customerEventMapper = new CustomerEventMapper(obj.id, obj, attributeMappings);
    let profile = null;

    if (customerEventMapper.getProfileIntegrationId()) {
      profile = {
        id: customerEventMapper.getProfileIntegrationId(),
        payload: NewCustomerProfile.constructFromObject({
          attributes: customerEventMapper.mapAttributes(),
        }),
      };
    }

    return profile;
  }
}

module.exports = { CustomerProfileFactory };
