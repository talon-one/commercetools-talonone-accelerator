'use strict';
const { CtpApiClientMockService } = require('../services/ctp-api-client-mock');
const { CtpApiClientService } = require('../services/ctp-api-client');
const { BroadcastApiClient } = require('../services/broadcast-api-client');
const { LoggerService } = require('../services/logger');
const { ApiClientService } = require('../services/api-client');
const { ApiClientMockService } = require('../services/api-client-mock');
const { MapperSettings } = require('./mapper-settings');
const { EventValidationMode } = require('./event-validation-mode');
const { CloudProvider } = require('./cloud-provider');
const Decimal = require('decimal.js');

const TALON_ONE_API_KEY_V1_PREFIX = 'TALON_ONE_API_KEY_V1_';
const TALON_ONE_API_BASE_PATH_PREFIX = 'TALON_ONE_API_BASE_PATH_';

class Env {
  /**
   * @return {4|5|6}
   */
  static getRoundingMode() {
    const rounding = process.env.ROUNDING_MODE;

    switch (rounding) {
      case 'ROUND_HALF_UP':
      case 'ROUND_HALF_DOWN':
        return Decimal[rounding];

      default:
        return Decimal.ROUND_HALF_EVEN;
    }
  }

  /**
   * @return {string}
   */
  static getCtpLineItemMetadataTypeKey() {
    return process.env.CTP_LINE_ITEM_METADATA_TYPE_KEY ?? 'talon_one_line_item_metadata';
  }

  /**
   * @return {string}
   */
  static getCtpCartMetadataTypeKey() {
    return process.env.CTP_CART_METADATA_TYPE_KEY ?? 'talon_one_cart_metadata';
  }

  /**
   * @return {string}
   */
  static getCtpCustomerMetadataTypeKey() {
    return process.env.CTP_CUSTOMER_METADATA_TYPE_KEY ?? 'talon_one_customer_metadata';
  }

  /**
   * @return {string}
   */
  getLoggerMode() {
    return process.env.LOGGER_MODE ?? 'NONE';
  }

  /**
   * @return {string}
   */
  getProvider() {
    return process.env.PROVIDER ?? CloudProvider.AWS;
  }

  /**
   * @return {string}
   */
  getBasicAuthUsername() {
    return process.env.BASIC_AUTH_USERNAME;
  }

  /**
   * @return {string}
   */
  getBasicAuthPassword() {
    return process.env.BASIC_AUTH_PASSWORD;
  }

  /**
   * @return {number}
   */
  getEventValidationMode() {
    return EventValidationMode[process.env.EVENT_VALIDATION_MODE] ?? EventValidationMode.SIMPLE;
  }

  /**
   * @return {string}
   */
  getCartAttributeMapping() {
    return process.env.CART_ATTRIBUTE_MAPPING ?? '';
  }

  /**
   * @return {string}
   */
  getCartItemAttributeMapping() {
    return process.env.CART_ITEM_ATTRIBUTE_MAPPING ?? '';
  }

  /**
   * @return {boolean}
   */
  isUnitTest() {
    return !!parseInt(process.env.UNIT_TEST, 10);
  }

  /**
   * @return {MapperSettings}
   */
  getMapperSettings() {
    return new MapperSettings(
      process.env.DISCOUNT_TAX_CATEGORY_ID,
      process.env.LANGUAGE,
      process.env.SKU_TYPE,
      process.env.SKU_SEPARATOR,
      !!parseInt(process.env.VERIFY_PRODUCT_IDENTIFIERS, 10),
      !!parseInt(process.env.VERIFY_TAX_IDENTIFIERS, 10),
      process.env.PAY_WITH_POINTS_ATTRIBUTE_NAME
    );
  }

  /**
   * @return {LoggerService}
   */
  getLoggerService() {
    return new LoggerService(this.getLoggerMode());
  }

  /**
   * @return {any}
   */
  getAttributeMappings() {
    const mappings = process.env.TALON_ONE_ATTRIBUTES_MAPPINGS;

    if (mappings) {
      try {
        return JSON.parse(mappings);
      } catch (e) {
        //
      }
    }

    return {};
  }

  /**
   * @return {function(): BroadcastApiClient}
   */
  getBroadcastApiClient() {
    let instance;

    return () => {
      if (instance) {
        return instance;
      }

      const apiClients = [];

      Object.keys(this._getAvailableCurrencies()).forEach((currencyCode) =>
        apiClients.push(this.getApiClient()(currencyCode))
      );

      instance = new BroadcastApiClient(apiClients);

      return instance;
    };
  }

  /**
   * @return {function(): ApiClientService|ApiClientMockService}
   */
  getApiClient() {
    const ApiClient = this.isUnitTest() ? ApiClientMockService : ApiClientService;
    const instances = {};

    return (currencyCode = null) => {
      if (instances[currencyCode]) {
        return instances[currencyCode];
      }

      const credentials = this._getApiCredentials(currencyCode);
      instances[currencyCode] = new ApiClient(credentials.path, credentials.key, currencyCode);

      return instances[currencyCode];
    };
  }

  /**
   * @return {function(): CtpApiClientService|CtpApiClientMockService}
   */
  getCtpApiClient() {
    const ApiClient = this.isUnitTest() ? CtpApiClientMockService : CtpApiClientService;
    let instance;

    return () => {
      if (instance) {
        return instance;
      }

      instance = new ApiClient(
        process.env.CTP_AUTH_URL,
        process.env.CTP_API_URL,
        process.env.CTP_PROJECT_KEY,
        process.env.CTP_CLIENT_ID,
        process.env.CTP_CLIENT_SECRET
      );

      return instance;
    };
  }

  /**
   * @return {Object}
   * @private
   */
  _getAvailableCurrencies() {
    const availableCurrencies = {};
    const len = TALON_ONE_API_KEY_V1_PREFIX.length;

    Object.keys(process.env).forEach((key) => {
      const currencyCode = key.slice(-3);
      if (
        process.env[key] &&
        key.slice(0, len) === TALON_ONE_API_KEY_V1_PREFIX &&
        process.env[`${TALON_ONE_API_BASE_PATH_PREFIX}${currencyCode}`]
      ) {
        availableCurrencies[currencyCode] = true;
      }
    });

    return availableCurrencies;
  }

  /**
   * @param {null|string} currencyCode
   * @return {null|string}
   * @private
   */
  _getValidCurrency(currencyCode) {
    const availableCurrencies = this._getAvailableCurrencies();

    if (currencyCode && availableCurrencies[currencyCode]) {
      return currencyCode;
    }

    if (availableCurrencies[process.env.TALON_ONE_FALLBACK_CURRENCY]) {
      return process.env.TALON_ONE_FALLBACK_CURRENCY;
    }

    return null;
  }

  /**
   * @param {null|string} currencyCode
   * @return {{path: string, key: string}}
   * @private
   */
  _getApiCredentials(currencyCode) {
    const validCurrencyCode = this._getValidCurrency(currencyCode);

    if (!validCurrencyCode) {
      throw new Error('Invalid currency code.');
    }

    const credentials = {
      key: process.env[`${TALON_ONE_API_KEY_V1_PREFIX}${validCurrencyCode}`],
      path: process.env[`${TALON_ONE_API_BASE_PATH_PREFIX}${validCurrencyCode}`],
    };

    if (!credentials.key || !credentials.path) {
      throw new Error('Invalid TALON_ONE_API_* configuration.');
    }

    return credentials;
  }
}

module.exports = { Env };
