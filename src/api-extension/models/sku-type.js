'use strict';

/**
 * @readonly
 * @enum {int}
 */
const SkuType = Object.freeze({
  CTP_PRODUCT_ID: 1,
  CTP_PRODUCT_ID_WITH_VARIANT_ID: 2,
  CTP_VARIANT_SKU: 3,
});

module.exports = { SkuType };
