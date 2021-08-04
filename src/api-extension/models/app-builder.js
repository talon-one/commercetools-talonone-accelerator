'use strict';
const middy = require('@middy/core');
const timePlugin = require('../plugins/time');
const { CloudProvider } = require('./cloud-provider');
const { googleMiddy } = require('./google-middy');

class AppBuilder {
  constructor(handler, logger, provider, username, password) {
    switch (provider) {
      case CloudProvider.AWS:
        this.handler = middy(handler, timePlugin({ logger: logger.info.bind(logger) }));
        break;
      case CloudProvider.GCP:
        this.handler = googleMiddy(handler, username, password);
        break;
      default:
        throw new Error('Invalid provider.');
    }

    this.provider = provider;
    this.config = {};
    this.setLogger(logger);
  }

  /**
   * @param logger
   * @returns {AppBuilder}
   */
  setLogger(logger) {
    this.config.logger = logger;

    return this;
  }

  /**
   * @param mappings
   * @returns {AppBuilder}
   */
  setAttributeMappings(mappings) {
    this.config.attributeMappings = mappings;

    return this;
  }

  /**
   * @param {string} spec
   * @returns {AppBuilder}
   */
  setCartAttributeMapping(spec) {
    this.config.cartAttributeMapping = spec;

    return this;
  }

  /**
   * @param {string} spec
   * @returns {AppBuilder}
   */
  setCartItemAttributeMapping(spec) {
    this.config.cartItemAttributeMapping = spec;

    return this;
  }

  /**
   * @param {number} value
   * @returns {AppBuilder}
   */
  setEventValidationMode(value) {
    this.config.eventValidationMode = value;

    return this;
  }

  /**
   * @param {MapperSettings} settings
   * @returns {AppBuilder}
   */
  setMapperSettings(settings) {
    this.config.mapperSettings = settings;

    return this;
  }

  /**
   * @param apiClient
   * @returns {AppBuilder}
   */
  setApiClient(apiClient) {
    this.config.apiClient = apiClient;

    return this;
  }

  /**
   * @param apiClient
   * @returns {AppBuilder}
   */
  setCtpApiClient(apiClient) {
    this.config.ctpApiClient = apiClient;

    return this;
  }

  /**
   * @param broadcastApiClient
   * @returns {AppBuilder}
   */
  setBroadcastApiClient(broadcastApiClient) {
    this.config.broadcastApiClient = broadcastApiClient;

    return this;
  }

  /**
   * @param middleware
   * @returns {AppBuilder}
   */
  use(middleware) {
    this.handler.use(middleware(this.config));

    return this;
  }

  build() {
    switch (this.provider) {
      case CloudProvider.GCP:
        return this.handler.main;
      default:
        return this.handler;
    }
  }
}

module.exports = { AppBuilder };
