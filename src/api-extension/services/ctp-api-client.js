'use strict';
const clientCreate = require('@commercetools/sdk-client');
const middlewareAuth = require('@commercetools/sdk-middleware-auth');
const createMiddleware = require('@commercetools/sdk-middleware-http');
const clientQueue = require('@commercetools/sdk-middleware-queue');
const requestBuilder = require('@commercetools/api-request-builder');
const fetch = require('node-fetch');

class CtpApiClientService {
  /**
   * @param {string} authUrl
   * @param {string} apiUrl
   * @param {string} projectKey
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {number} [concurrency=5]
   */
  constructor(authUrl, apiUrl, projectKey, clientId, clientSecret, concurrency = 5) {
    const instance = this.constructor.instance?.[clientId];

    if (instance) {
      return instance;
    }

    const authMiddleware = middlewareAuth.createAuthMiddlewareForClientCredentialsFlow({
      host: authUrl,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      fetch,
    });

    const httpMiddleware = createMiddleware.createHttpMiddleware({
      host: apiUrl,
      fetch,
    });

    const queueMiddleware = clientQueue.createQueueMiddleware({
      concurrency,
    });

    this.client = clientCreate.createClient({
      middlewares: [authMiddleware, httpMiddleware, queueMiddleware],
    });

    this.products = requestBuilder.createRequestBuilder({ projectKey }).products;
    this.customers = requestBuilder.createRequestBuilder({ projectKey }).customers;

    if (!this.constructor.instance) {
      this.constructor.instance = {};
    }

    this.constructor.instance[clientId] = this;
  }

  async fetchCustomerById(id) {
    if (!this._checkUuidV4(id)) {
      return {};
    }

    return this._fetch(this.customers.byId(id).build()).then((data) => data?.body);
  }

  async updateCustomerById(id, version, actions) {
    if (!this._checkUuidV4(id)) {
      return {};
    }

    return this._update(this.customers.byId(id).build(), version, actions);
  }

  async fetchProductsBySkus(skus) {
    skus = skus.join('","');

    if (skus.length < 4) {
      return [];
    }

    return this._fetch(
      this.products.where(`masterData(current(variants(sku in ("${skus}"))))`).withTotal().build()
    );
  }

  async fetchProductsByProductIds(ids) {
    ids = ids
      // filter invalid UUID
      .filter(this._checkUuidV4)
      .join('","');

    if (ids.length < 5) {
      return [];
    }

    return this._fetch(this.products.where(`id in ("${ids}")`).withTotal().build());
  }

  _checkUuidV4(v) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  }

  async _fetch(uri) {
    const fetchRequest = {
      uri,
      method: 'GET',
    };

    return this.client.execute(fetchRequest);
  }

  async _update(uri, version, actions) {
    const fetchRequest = {
      uri,
      method: 'POST',
      body: JSON.stringify({ version, actions }),
    };

    return this.client.execute(fetchRequest);
  }
}

module.exports = { CtpApiClientService };
