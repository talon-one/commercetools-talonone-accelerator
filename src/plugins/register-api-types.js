'use strict';
const Plugin = require('./plugin');
const requestBuilder = require('@commercetools/api-request-builder');
const { TalonOneCartMetadata } = require('../api-extension/models/talon-one-cart-metadata');
const { TalonOneCustomerMetadata } = require('../api-extension/models/talon-one-customer-metadata');
const {
  TalonOneLineItemMetadata,
} = require('../api-extension/models/talon-one-line-item-metadata');

class RegisterApiExtensionPlugin extends Plugin {
  constructor(serverless, options) {
    super(serverless, options);

    this.commands = {
      'register-api-types': {
        usage: 'Create Commercetools API Types',
        lifecycleEvents: ['execute'],
      },
    };

    this.hooks = {
      'register-api-types:execute': this.execute.bind(this),
    };
  }

  /**
   * @param {string} type
   * @param {string} body
   * @returns {Promise}
   */
  async createType(type, body) {
    const projectKey = this.projectKey;
    const client = await this.getClient();
    this.serverless.cli.log(`Creating type ${type}`);

    const url = requestBuilder.createRequestBuilder({ projectKey }).types.build();
    const request = {
      uri: url,
      method: 'POST',
      body,
    };

    return client.execute(request).catch(console.error);
  }

  async execute() {
    for (const { type, body } of [
      { type: TalonOneLineItemMetadata.key, body: this.lineItemMetadataTypeBody },
      { type: TalonOneCartMetadata.key, body: this.cartMetadataTypeBody },
      { type: TalonOneCustomerMetadata.key, body: this.customerMetadataTypeBody },
    ]) {
      await this.createType(type, body);
    }
  }
}

module.exports = RegisterApiExtensionPlugin;
