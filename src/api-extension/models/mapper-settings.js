'use strict';
const { SkuType } = require('./sku-type');

class MapperSettings {
  /**
   * @param {string} taxCategoryId
   * @param {string} lang
   * @param {string} skuTypeKey
   * @param {string} skuSeparator
   * @param {boolean} verifyFreeItems
   */
  constructor(taxCategoryId, lang, skuTypeKey, skuSeparator, verifyFreeItems) {
    if (!SkuType[skuTypeKey]) {
      throw new Error('Invalid skuType.');
    }

    this.taxCategoryId = taxCategoryId;
    this.lang = lang;
    this.skuType = SkuType[skuTypeKey];
    this.skuSeparator = skuSeparator;
    this.verifyFreeItemsFlag = verifyFreeItems;
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
