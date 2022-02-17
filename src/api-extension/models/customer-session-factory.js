'use strict';
const { OrderEventMapper } = require('./order-event-mapper');
const { NewCustomerSessionV2 } = require('talon_one');
const { CartEventMapper } = require('./cart-event-mapper');
const { TalonOneCartMetadata } = require('./talon-one-cart-metadata');

/**
 * @typedef {Object} CustomerSessionObject
 * @property {string} id
 * @property {NewCustomerSessionV2} payload
 */

class CustomerSessionFactory {
  /**
   * @param {CtpCartEvent} event
   * @param {string} lang
   * @param {string} cartAttributeMapping
   * @param {string} cartItemAttributeMapping
   * @param {LoggerService} logger
   * @param {string} currencyCode
   * @param {string} payWithPointsAttributeName
   * @returns {null|CustomerSessionObject}
   */
  static constructFromCartEvent(
    { resource: { obj } } = { resource: { obj: {} } },
    lang,
    cartAttributeMapping,
    cartItemAttributeMapping,
    logger,
    currencyCode,
    payWithPointsAttributeName
  ) {
    let session = null;
    const cartEventMapper = new CartEventMapper(
      obj,
      lang,
      cartAttributeMapping,
      cartItemAttributeMapping,
      logger,
      currencyCode,
      payWithPointsAttributeName
    );

    if (cartEventMapper.getSessionIntegrationId()) {
      session = {
        id: cartEventMapper.getSessionIntegrationId(),
        payload: NewCustomerSessionV2.constructFromObject({
          integrationId: cartEventMapper.getSessionIntegrationId(),
          cartItems: cartEventMapper.getCartItems(),
          couponCodes: cartEventMapper.getCouponCodes(),
        }),
      };

      const attrs = cartEventMapper.getAttributes();

      if (attrs && typeof attrs === 'object' && Object.keys(attrs).length) {
        session.payload.attributes = attrs;
      }

      if (cartEventMapper.getProfileIntegrationId()) {
        session.payload.profileId = cartEventMapper.getProfileIntegrationId();

        const referralCode = cartEventMapper.getReferralCode();

        if (referralCode) {
          session.payload.referralCode = referralCode;
        } else if (
          obj?.custom?.fields?.[TalonOneCartMetadata.referralCodesFieldName] !== undefined
        ) {
          session.payload.referralCode = '';
        }
      }
    }

    return session;
  }

  /**
   * @param {CtpOrderEvent} event
   * @returns {null|CustomerSessionObject}
   */
  static constructFromOrderEvent(
    {
      resource: {
        obj: {
          orderState,
          cart: { id: cartId },
        },
      },
    } = { resource: { obj: {} } }
  ) {
    const orderEventMapper = new OrderEventMapper(cartId, orderState);
    let session = null;

    if (orderEventMapper.getSessionIntegrationId()) {
      session = {
        id: orderEventMapper.getSessionIntegrationId(),
        payload: NewCustomerSessionV2.constructFromObject({
          integrationId: orderEventMapper.getSessionIntegrationId(),
          state: orderEventMapper.getState(),
        }),
      };
    }

    return session;
  }
}

module.exports = { CustomerSessionFactory };
