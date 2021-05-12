'use strict';
const { SkuType } = require('./sku-type');

class MapperSettings {
  /**
   * @param {string} taxCategoryId
   * @param {string} lang
   * @param {string} skuTypeKey
   * @param {string} skuSeparator
   * @param {boolean} verifyFreeItems
   * @param {string} payWithPointsAttributeName
   */
  constructor(
    taxCategoryId,
    lang,
    skuTypeKey,
    skuSeparator,
    verifyFreeItems,
    payWithPointsAttributeName
  ) {
    if (!SkuType[skuTypeKey]) {
      throw new Error('Invalid skuType.');
    }

    this.taxCategoryId = taxCategoryId;
    this.lang = lang;
    this.skuType = SkuType[skuTypeKey];
    this.skuSeparator = skuSeparator;
    this.verifyFreeItemsFlag = verifyFreeItems;
    this.payWithPointsAttributeName = payWithPointsAttributeName;
  }

  /**
   * @returns {string}
   */
  getPayWithPointsAttributeName() {
    return this.payWithPointsAttributeName;
  }

  /**
   * @returns {string}
   */
  getTaxCategoryId() {
    return this.taxCategoryId;
  }

  /**
   * @returns {string}
   */
  getLang() {
    return this.lang;
  }

  /**
   * @returns {SkuType}
   */
  getSkuType() {
    return this.skuType;
  }

  /**
   * @returns {boolean}
   */
  getVerifyFreeItemsFlag() {
    return this.verifyFreeItemsFlag;
  }

  /**
   * @returns {string}
   */
  getSkuSeparator() {
    return this.skuSeparator;
  }
}

module.exports = { MapperSettings };
