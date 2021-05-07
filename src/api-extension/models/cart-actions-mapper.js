'use strict';
const { SetCustomTypeBuilder } = require('./set-custom-type-builder');
const { TalonOneCartMetadata } = require('./talon-one-cart-metadata');
const { SkuType } = require('./sku-type');
const { EffectType } = require('./effect-type');
const { ChangeLineItemQuantityBuilder } = require('./change-line-item-quantity-builder');
const { TalonOneLineItemMetadata } = require('./talon-one-line-item-metadata');
const { UpdateAction } = require('./update-action');
const { RemoveCustomLineItemBuilder } = require('./remove-custom-line-item-builder');

class CartActionsMapper {
  /**
   * Configures CartActionsMapper.
   *
   * @param {MapperSettings} mapperSettings
   * @param {CtpLineItem[]} lineItems
   * @param {CtpCustomLineItem[]} customLineItems
   * @param {function(): CtpApiClientService} ctpApiClient
   * @param {LoggerService} logger
   */
  constructor(mapperSettings, lineItems, customLineItems, ctpApiClient, logger) {
    this.lineItems = lineItems;
    this.customLineItems = customLineItems;
    this.ctpApiClient = ctpApiClient();
    this.logger = logger;

    /**
     * @type {MapperSettings}
     */
    this.mapperSettings = mapperSettings;
    this.skuType = this.mapperSettings.getSkuType();
    this.verifyFreeItems = this.mapperSettings.getVerifyFreeItemsFlag();
  }

  /**
   * @param {Object[]} actions
   * @returns {Object}
   */
  async process(actions) {
    const pipes = [
      this._compactSetCustomTypeActions,
      this._compactAddLineItemActions,
      this._removeFreeItems,
      this._removeCustomLines,
      this._removeNotifications,
      this._verifyFreeItems,
    ];

    let result = [...actions];

    for (const pipe of pipes) {
      const fn = pipe.bind(this);
      result = await fn(result);
    }

    return result;
  }

  /**
   * @param {Object[]} actions
   * @returns {[]|Object[]} CTP Cart Update Actions.
   * @private
   */
  _removeCustomLines(actions) {
    const remove = [];

    // remove all custom lines before applying new ones
    // @todo: can cause an error when we have custom lines from another application
    // @todo: can be optimized
    for (const customLineItem of this.customLineItems) {
      const couponCode = customLineItem.custom.fields?.[TalonOneCartMetadata.couponCode];
      const couponCodeAction =
        customLineItem.custom.fields?.[TalonOneCartMetadata.couponCodeAction];

      if (couponCodeAction === TalonOneCartMetadata.applyCoupon && couponCode) {
        continue;
      }

      const builder = new RemoveCustomLineItemBuilder();
      remove.push(builder.customLineItemId(customLineItem.id).build());
    }

    return [...remove, ...actions];
  }

  /**
   * @param {Object[]} actions
   * @returns {[]|Object[]} CTP Cart Update Actions.
   * @private
   */
  _compactAddLineItemActions(actions) {
    const result = [...actions];
    const index = {};

    const addToIndex = (id, pos) => {
      index[id] = {
        positions: index[id] ? [...index[id].positions, pos] : [pos],
        compact: Boolean(index[id]),
      };
    };

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const pos in actions) {
      const action = actions[pos];

      if (action.action === UpdateAction.addLineItem) {
        addToIndex(this._getIdFromAction(action), pos);
      }
    }

    // compact the same actions
    for (const i of Object.keys(index)) {
      const { compact, positions } = index[i];

      if (compact) {
        let last = null;
        let quantity = 0;

        for (const pos of positions) {
          last = result[pos];
          quantity += last?.quantity ?? 1;
          delete result[pos];
        }

        result.push({
          ...last,
          quantity,
        });
      }
    }

    // reindex
    return result.filter((val) => val);
  }

  /**
   * @param {Object[]} actions
   * @returns {[]|Object[]} CTP Cart Update Actions.
   * @private
   */
  _removeNotifications(actions) {
    const result = [];
    let remove = true;

    for (const action of actions) {
      if (action.action === UpdateAction.setCustomType) {
        remove = false;
        break;
      }
    }

    if (remove) {
      const builder = new SetCustomTypeBuilder();
      result.push(builder.build());
    }

    return [...result, ...actions];
  }

  /**
   * @param {Object[]} actions
   * @returns {[]|Object[]} CTP Cart Update Actions.
   * @private
   */
  _compactSetCustomTypeActions(actions) {
    const result = [...actions];
    const index = {};

    const addToIndex = (id, pos) => {
      index[id] = {
        positions: index[id] ? [...index[id].positions, pos] : [pos],
        compact: Boolean(index[id]),
      };
    };

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const pos in actions) {
      const action = actions[pos];

      if (action.action === UpdateAction.setCustomType && action?.type?.key) {
        addToIndex(action.type.key, pos);
      }
    }

    // compact the same actions
    for (const i of Object.keys(index)) {
      const { compact, positions } = index[i];

      if (i !== TalonOneCartMetadata.key) {
        continue;
      }

      if (compact) {
        const notifications = [];
        const restFields = {};
        let last = null;

        for (const pos of positions) {
          last = result[pos];

          for (const field of Object.keys(last.fields)) {
            switch (field) {
              case TalonOneCartMetadata.notificationsFieldName:
                notifications.push(...JSON.parse(last.fields[field]));
                break;

              default:
                restFields[field] = last.fields[field];
                break;
            }
          }

          delete result[pos];
        }

        const builder = new SetCustomTypeBuilder();

        builder.cartType().fields({
          [TalonOneCartMetadata.notificationsFieldName]: JSON.stringify(notifications),
          ...restFields,
        });

        result.push(builder.build());
      }
    }

    // reindex
    return result.filter((val) => val);
  }

  /**
   * @param {Object[]} actions
   * @returns {[]|Object[]} CTP Cart Update Actions.
   * @private
   */
  _removeFreeItems(actions) {
    const result = [];

    for (const lineItem of this.lineItems) {
      const effect = lineItem.custom?.fields?.[TalonOneLineItemMetadata.effectFieldName];

      if (effect === EffectType.addFreeItem) {
        const builder = new ChangeLineItemQuantityBuilder();

        builder.lineItemId(lineItem.id);
        builder.quantity(0);

        result.push(builder.build());
      }
    }

    return [...result, ...actions];
  }

  /**
   * @param {Object[]} actions
   * @returns {[]|Object[]} CTP Cart Update Actions.
   * @private
   */
  async _verifyFreeItems(actions) {
    if (!this.verifyFreeItems) {
      return actions;
    }

    const freeItems = [];
    const { fetchId, fetcher } = this._helpers();

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const pos in actions) {
      const action = actions[pos];
      const effect = action.custom?.fields?.[TalonOneLineItemMetadata.effectFieldName];

      if (effect === EffectType.addFreeItem) {
        freeItems.push({
          fetchId: fetchId(action),
          indexId: this._getIdFromAction(action),
          pos,
        });
      }
    }

    let data;
    const dataIndex = {};

    try {
      data = await fetcher(freeItems.map((v) => v.fetchId));
    } catch (err) {
      this.logger.error(err);
    }

    this.logger.test(data, true);

    if (Array.isArray(data?.body?.results)) {
      for (const product of data?.body.results) {
        const masterVariant = product?.masterData?.current?.masterVariant;

        if (masterVariant) {
          dataIndex[this._prepareId(masterVariant.sku, product.id, masterVariant.id)] = product;
        }

        const variants = product?.masterData?.current?.variants;

        if (Array.isArray(variants)) {
          for (const { id, sku } of variants) {
            dataIndex[this._prepareId(sku, product.id, id)] = product;
          }
        }
      }
    }

    for (const freeItem of freeItems) {
      if (!dataIndex[freeItem.indexId]) {
        this.logger.info({
          invalidProductSku: freeItem,
        });
        delete actions[freeItem.pos];
      }
    }

    // reindex
    return actions.filter((val) => val);
  }

  /**
   * @returns {Object}
   * @private
   */
  _helpers() {
    let fetchId;
    let fetcher;

    switch (this.skuType) {
      case SkuType.CTP_PRODUCT_ID:
      case SkuType.CTP_PRODUCT_ID_WITH_VARIANT_ID:
        fetchId = (action) => action.productId;
        fetcher = (ids) => this.ctpApiClient.fetchProductsByProductIds(ids);
        break;

      default:
        // SkuType.CTP_VARIANT_SKU
        fetchId = (action) => action.sku;
        fetcher = (skus) => this.ctpApiClient.fetchProductsBySkus(skus);
        break;
    }

    return { fetchId, fetcher };
  }

  /**
   * @param {string} sku
   * @param {string} productId
   * @param {number} variantId
   * @returns {string}
   * @private
   */
  _getIdFromAction({ sku, productId, variantId }) {
    return this._prepareId(sku, productId, variantId);
  }

  /**
   * @param {string} sku
   * @param {string} productId
   * @param {number} variantId
   * @returns {string}
   * @private
   */
  _prepareId(sku, productId, variantId) {
    switch (this.skuType) {
      case SkuType.CTP_PRODUCT_ID:
        return productId;

      case SkuType.CTP_PRODUCT_ID_WITH_VARIANT_ID:
        return `${productId}-${variantId}`;

      default:
        // SkuType.CTP_VARIANT_SKU
        return sku;
    }
  }
}

module.exports = { CartActionsMapper };
