'use strict';
const { NewCustomerProfile } = require('talon_one');
const { CartEventMapper } = require('./cart-event-mapper');
const { CustomerEventMapper } = require('./customer-event-mapper');

/**
 * @typedef {Object} CustomerProfileObject
 * @property {string} id
 * @property {NewCustomerProfile} payload
 */

class CustomerProfileFactory {
  /**
   * @param {CtpCartEvent} event
   * @param {string} lang
   * @param {string} cartAttributeMapping
   * @param {string} cartItemAttributeMapping
   * @param {LoggerService} logger
   * @param {string} currencyCode
   * @returns {null|CustomerProfileObject}
   */
  static constructFromCartEvent(
    { resource: { obj } } = { resource: { obj: {} } },
    lang,
    cartAttributeMapping,
    cartItemAttributeMapping,
    logger,
    currencyCode
  ) {
    const cartEventMapper = new CartEventMapper(
      obj,
      lang,
      cartAttributeMapping,
      cartItemAttributeMapping,
      logger,
      currencyCode
    );
    let profile = null;

    if (cartEventMapper.getProfileIntegrationId()) {
      profile = {
        id: cartEventMapper.getProfileIntegrationId(),
        payload: NewCustomerProfile.constructFromObject({}),
      };
    }

    return profile;
  }

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
