'use strict';
const slugify = require('slugify');
const {
  // eslint-disable-next-line no-unused-vars
  CustomerSessionV2,
  SetDiscountEffectProps,
  AddFreeItemEffectProps,
  SetDiscountPerItemEffectProps,
  ShowNotificationEffectProps,
  RejectCouponEffectProps,
  AcceptCouponEffectProps,
  RejectReferralEffectProps,
  AcceptReferralEffectProps,
} = require('talon_one');
const { SetCustomTypeBuilder } = require('./set-custom-type-builder');
const { Notification, ErrorNotification, InfoNotification } = require('./notification');
const { AddLineItemBuilder } = require('./add-line-item-builder');
const { AddCustomLineItemBuilder } = require('./add-custom-line-item-builder');
const { SetLineItemTotalPriceBuilder } = require('./set-line-item-total-price-builder');
const { SkuType } = require('./sku-type');
const { MapperSettings } = require('./mapper-settings');
const { EffectType } = require('./effect-type');
const { Money } = require('./money');
const { MoneyType } = require('./money-type');
const { TalonOneLineItemMetadata } = require('./talon-one-line-item-metadata');

/**
 * Creates Cart Update Actions based on Talon.One effects and shopping cart from Commercetools.
 * @see https://docs.commercetools.com/api/projects/carts#update-actions
 */
class CartActionFactory {
  /**
   * Configures CartActionFactory.
   *
   * @param {MapperSettings} mapperSettings
   * @param {CtpCartEventResourceObject} cart
   * @param {CustomerSessionV2} talonSession
   * @param {string} currencyCode
   */
  constructor(mapperSettings, cart, talonSession, currencyCode) {
    if (!(mapperSettings instanceof MapperSettings)) {
      throw new Error('Invalid mapperSettings type.');
    }

    this.cart = cart;
    this.talonSession = talonSession;
    this.currencyCode = currencyCode;

    /**
     * @type {MapperSettings}
     */
    this.mapperSettings = mapperSettings;

    this.lang = this.mapperSettings.getLang();
    this.taxCategoryId = this.mapperSettings.getTaxCategoryId();
    this.skuType = this.mapperSettings.getSkuType();
    this.skuSeparator = this.mapperSettings.getSkuSeparator();

    this.allCustomLinesWasRemoved = false;
  }

  /**
   * @param {string} effectType
   * @param {Object} props
   * @param {string|null} triggeredByCoupon
   * @returns {[]|Object[]}
   */
  constructFromEffect(effectType, props, triggeredByCoupon) {
    if (EffectType[effectType] && typeof this[effectType] !== 'undefined') {
      return this[effectType](props, triggeredByCoupon);
    }
    return [];
  }

  /**
   * Converts the setDiscount effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @param {string|null} triggeredByCoupon
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  setDiscount(data, triggeredByCoupon) {
    const props = SetDiscountEffectProps.constructFromObject(data);

    const actions = [];
    const money = new Money(MoneyType.DECIMAL_PRECISION, this.currencyCode, props.value);
    const builder = new AddCustomLineItemBuilder();
    let slugName = props.name;

    if (triggeredByCoupon) {
      slugName = slugName.concat('-', triggeredByCoupon);
    }

    builder
      .name(this.lang, props.name)
      .price(money.getCentAmount() * -1, money.getCurrencyCode())
      .slug(slugify(slugName))
      .taxCategory(this.taxCategoryId)
      .effectMetadata(EffectType.setDiscount, triggeredByCoupon);

    actions.push(builder.build());

    return actions;
  }

  /**
   * Converts the setDiscountPerItem effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  setDiscountPerItem(data) {
    const props = SetDiscountPerItemEffectProps.constructFromObject(data);
    const actions = [];

    const builder = new SetLineItemTotalPriceBuilder();

    const position = props.position;
    let cartItem = null;
    let lineItem = null;

    this.talonSession.cartItems.forEach((item) => {
      if (item.position === position) {
        cartItem = item;
      }
    });

    if (cartItem === null) {
      return actions;
    }

    this.cart.lineItems.forEach((item) => {
      if (
        cartItem.sku === item.productId &&
        item.custom?.fields?.[TalonOneLineItemMetadata.effectFieldName] !== 'addFreeItem'
      ) {
        lineItem = item;
      }
    });

    if (lineItem === null) {
      return actions;
    }

    const {
      centAmount: baseCentAmount,
      currencyCode: baseCurrencyCode,
      fractionDigits: baseFractionDigits = 2,
    } = lineItem.price.value;

    const baseMoney = new Money(
      MoneyType.CENT_PRECISION,
      baseCurrencyCode,
      baseCentAmount,
      baseFractionDigits
    );
    const discountMoney = new Money(MoneyType.DECIMAL_PRECISION, this.currencyCode, props.value);
    const afterDiscountMoney = baseMoney.multiply(lineItem.quantity).subtract(discountMoney);

    builder
      .lineItemId(lineItem.id)
      .price(baseMoney.getCentAmount(), baseMoney.getCurrencyCode())
      .totalPrice(afterDiscountMoney.getCentAmount(), afterDiscountMoney.getCurrencyCode());

    actions.push(builder.build());

    return actions;
  }

  /**
   * Converts the addFreeItem effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  addFreeItem(data) {
    const props = AddFreeItemEffectProps.constructFromObject(data);
    const actions = [];
    const builder = new AddLineItemBuilder();

    builder.effectMetadata(EffectType.addFreeItem).price(0, this.currencyCode).quantity(1);

    switch (this.skuType) {
      case SkuType.CTP_PRODUCT_ID:
        builder.productId(props.sku);
        break;

      case SkuType.CTP_PRODUCT_ID_WITH_VARIANT_ID:
        // eslint-disable-next-line no-case-declarations
        const [productId, variantId = 1] = props.sku.split(this.skuSeparator, 2);
        builder.productId(productId).variantId(variantId);
        break;

      default:
        // SkuType.CTP_VARIANT_SKU
        builder.sku(props.sku);
        break;
    }

    actions.push(builder.build());

    return actions;
  }

  /**
   * Converts the showNotification effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  showNotification(data) {
    const { notificationType, title, body } = ShowNotificationEffectProps.constructFromObject(data);
    const actions = [];
    const builder = new SetCustomTypeBuilder();

    builder.notifications([
      new Notification(notificationType, title, body, EffectType.showNotification),
    ]);
    actions.push(builder.build());

    return actions;
  }

  /**
   * Converts the rejectCoupon effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @param {string|null} triggeredByCoupon
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  // eslint-disable-next-line no-unused-vars
  rejectCoupon(data, triggeredByCoupon = null) {
    const { value, rejectionReason } = RejectCouponEffectProps.constructFromObject(data);

    const actions = [];

    const builder = new SetCustomTypeBuilder();
    builder.notifications([
      new ErrorNotification('', value, EffectType.rejectCoupon, rejectionReason),
    ]);

    actions.push(builder.build());

    return actions;
  }

  /**
   * Converts the acceptCoupon effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @param {string|null} triggeredByCoupon
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  acceptCoupon(data, triggeredByCoupon) {
    const { value } = AcceptCouponEffectProps.constructFromObject(data);
    const money = new Money(MoneyType.DECIMAL_PRECISION, this.currencyCode, 0);
    const actions = [];

    const addCustomLineItemBuilder = new AddCustomLineItemBuilder();
    addCustomLineItemBuilder
      .name(this.lang, value)
      .price(money.getCentAmount(), money.getCurrencyCode())
      .slug(slugify(value))
      .taxCategory(this.taxCategoryId)
      .effectMetadata(EffectType.acceptCoupon, triggeredByCoupon);

    actions.push(addCustomLineItemBuilder.build());

    const builder = new SetCustomTypeBuilder();
    builder.notifications([new InfoNotification('', value, EffectType.acceptCoupon)]);
    actions.push(builder.build());

    return actions;
  }

  /**
   * Converts the rejectReferral effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  rejectReferral(data) {
    // eslint-disable-next-line prefer-const
    let { value, rejectionReason } = RejectReferralEffectProps.constructFromObject(data);
    const actions = [];
    const builder = new SetCustomTypeBuilder();
    const referralCode = this.cart?.custom?.fields?.talon_one_cart_referral_code;

    if (referralCode.search(value) !== -1) {
      value = referralCode;
    }

    builder.removeReferralCode();
    builder.notifications([
      new ErrorNotification('', value, EffectType.rejectReferral, rejectionReason),
    ]);

    actions.push(builder.build());

    return actions;
  }

  /**
   * Converts the acceptReferral effect to CTP Cart Update Actions.
   *
   * @param {Object} data
   * @returns {[]|Object[]} CTP Cart Update Actions.
   */
  acceptReferral(data) {
    let { value } = AcceptReferralEffectProps.constructFromObject(data);
    const actions = [];
    const builder = new SetCustomTypeBuilder();
    const referralCode = this.cart?.custom?.fields?.talon_one_cart_referral_code;

    if (referralCode) {
      builder.referralCode(referralCode);
    }

    if (referralCode.search(value) !== -1) {
      value = referralCode;
    }

    builder.notifications([new InfoNotification('', value, EffectType.acceptReferral)]);
    actions.push(builder.build());

    return actions;
  }
}

module.exports = { CartActionFactory };
