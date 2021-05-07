'use strict';
const ServerlessCommercetoolsPlugin = require('serverless-commercetools-plugin');
const clientCreate = require('@commercetools/sdk-client');
const middlewareAuth = require('@commercetools/sdk-middleware-auth');
const createMiddleware = require('@commercetools/sdk-middleware-http');
const clientQueue = require('@commercetools/sdk-middleware-queue');
const fetch = require('node-fetch');

const AWS_PROVIDER = 'aws';

/**
 * @property {string} projectKey
 * @property {string} clientId
 * @property {string} clientSecret
 * @property {string} apiUrl
 * @property {string} authURL
 * @property {string} talonApiKey
 * @property {string} talonBasePath
 * @property {string} talonAttributesMappings
 * @property {string} lineItemMetadataTypeBody
 * @property {string} cartMetadataTypeBody
 * @property {string} customerMetadataTypeBody
 * @property {Object} serverless
 * @property {any} serverless.cli
 */
class Plugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.serverlessCommercetoolsPlugin = new ServerlessCommercetoolsPlugin(serverless, options);

    ({
      CTP_PROJECT_KEY: this.projectKey,
      CTP_CLIENT_ID: this.clientId,
      CTP_CLIENT_SECRET: this.clientSecret,
      CTP_API_URL: this.apiUrl,
      CTP_AUTH_URL: this.authURL,
      TALON_ONE_API_KEY_V1: this.talonApiKey,
      TALON_ONE_BASE_PATH: this.talonBasePath,
      TALON_ONE_ATTRIBUTES_MAPPINGS: this.talonAttributesMappings,
      CTP_LINE_ITEM_METADATA_TYPE_BODY: this.lineItemMetadataTypeBody,
      CTP_CART_METADATA_TYPE_BODY: this.cartMetadataTypeBody,
      CTP_CUSTOMER_METADATA_TYPE_BODY: this.customerMetadataTypeBody,
    } = this.serverless.service.provider.environment);

    this.provider = this.serverless.service.provider.name;

    if (this.provider !== AWS_PROVIDER) {
      throw new Error('Unsupported provider. Please choose aws.');
    }
  }

  async getClient() {
    const projectKey = this.projectKey;

    const authMiddleware = middlewareAuth.createAuthMiddlewareForClientCredentialsFlow({
      host: this.authURL,
      projectKey,
      credentials: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      },
      fetch,
    });

    const httpMiddleware = createMiddleware.createHttpMiddleware({
      host: this.apiUrl,
      fetch,
    });

    const queueMiddleware = clientQueue.createQueueMiddleware({
      concurrency: 5,
    });

    return clientCreate.createClient({
      middlewares: [authMiddleware, httpMiddleware, queueMiddleware],
    });
  }
}

module.exports = Plugin;
