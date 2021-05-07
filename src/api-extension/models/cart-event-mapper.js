'use strict';
const { REFERRAL_CODE_SEPARATOR } = require('./customer-action-factory');
const { DataMapper } = require('./data-mapper');
const { EffectType } = require('./effect-type');
const { TalonOneLineItemMetadata } = require('./talon-one-line-item-metadata');
const { TalonOneCartMetadata } = require('./talon-one-cart-metadata');
const { CartItem } = require('talon_one');
const { Money } = require('./money');

class CartEventMapper {
  /**
   * @param {CtpCartEventResourceObject} cart
   * @param {string} lang
   * @param {string} cartAttributeMapping
   * @param {string} cartItemAttributeMapping
   * @param {LoggerService} logger
   * @param {string} currencyCode
   */
  constructor(cart, lang, cartAttributeMapping, cartItemAttributeMapping, logger, currencyCode) {
    this.cart = cart;
    this.lang = lang;
    this.cartId = cart.id;
    this.customerId = cart.customerId;
    this.totalPrice = cart.totalPrice;
    this.lineItems = cart.lineItems;
    this.customLineItems = cart.customLineItems;
    this.custom = cart.custom;
    this.cartAttributeMapping = cartAttributeMapping;
    this.cartItemAttributeMapping = cartItemAttributeMapping;
    this.logger = logger;
    this.currencyCode = currencyCode;
  }

  getSessionIntegrationId() {
    return this.cartId;
  }

  getProfileIntegrationId() {
    return this.customerId;
  }

  getCartItems() {
    const lineItems = this.lineItems ?? [];
    const cartItems = [];

    for (const i of lineItems) {
      // skip free items
      if (
        i?.custom?.fields?.[TalonOneLineItemMetadata.effectFieldName] === EffectType.addFreeItem
      ) {
        continue;
      }
      cartItems.push(
        CartItem.constructFromObject({
          name: i.name[this.lang],
          sku: i.productId,
          quantity: i.quantity,
          price: this.getDecimalAmount(i.price.value),
          attributes: this.getLineAttributes(i) || {},
        })
      );
    }

    return cartItems;
  }

  getCouponCodes() {
    const customLineItems = this.customLineItems ?? [];
    const couponCodes = [];
    let couponToRemove = null;
    const couponCodeAction = this.custom?.fields[TalonOneCartMetadata.couponCodeAction];

    if (couponCodeAction === TalonOneCartMetadata.applyCoupon) {
      couponCodes.push(this.custom.fields[TalonOneCartMetadata.couponCode]);
    }

    if (couponCodeAction === TalonOneCartMetadata.removeCoupon) {
      couponToRemove = this.custom.fields[TalonOneCartMetadata.couponCode];
    }

    for (const customLineItem of customLineItems) {
      const couponCode =
        customLineItem.custom.fields?.[TalonOneLineItemMetadata.couponCodeFieldName];

      if (!couponCode || couponCode === couponToRemove) {
        continue;
      }

      couponCodes.push(couponCode);
    }

    return couponCodes;
  }

  /**
   * @returns {Object|null}
   */
  getAttributes() {
    if (this.cartAttributeMapping) {
      const dataMapper = new DataMapper(this.cartAttributeMapping, this.logger);

      return dataMapper.process(this.cart);
    }

    return null;
  }

  /**
   * @returns {Object|null}
   */
  getReferralCode() {
    const code = this.cart?.custom?.fields?.talon_one_cart_referral_code ?? null;

    if (code) {
      const parts = code.split(REFERRAL_CODE_SEPARATOR);

      if (parts.includes(this.currencyCode)) {
        return parts[parts.indexOf(this.currencyCode) + 1] ?? null;
      }
    }

    return code;
  }

  getDecimalAmount({ type, currencyCode, centAmount, fractionDigits } = {}) {
    const price = new Money(type, currencyCode, centAmount, fractionDigits);

    return price.getDecimalAmount();
  }

  /**
   * @param {CtpLineItem} lineItem
   * @returns {Object}
   */
  getLineAttributes(lineItem) {
    if (this.cartItemAttributeMapping) {
      const dataMapper = new DataMapper(this.cartItemAttributeMapping, this.logger);

      try {
        const obj = {};
        lineItem?.variant?.attributes?.forEach((v) => {
          obj[v.name] = v.value;
        });
        return dataMapper.process(obj);
      } catch (e) {
        this.logger.error(e);
      }
    }

    return {};
  }
}

module.exports = { CartEventMapper };
