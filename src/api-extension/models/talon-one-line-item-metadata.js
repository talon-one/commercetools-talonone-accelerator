'use strict';
const { Env } = require('./env');

/**
 * @readonly
 * @enum {string}
 */
const TalonOneLineItemMetadata = Object.freeze({
  key: Env.getCtpLineItemMetadataTypeKey(),
  effectFieldName: 'talon_one_line_item_effect',
  couponCodeFieldName: 'talon_one_coupon_code',
});

module.exports = { TalonOneLineItemMetadata };
