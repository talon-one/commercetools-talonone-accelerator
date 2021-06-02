'use strict';
const { productsResponse, customerResponse, updateCustomerResponse } = require('../mocks');

class CtpApiClientMockService {
  constructor(authUrl, apiUrl, projectKey, clientId, clientSecret) {
    this.authUrl = authUrl;
    this.apiUrl = apiUrl;
    this.projectKey = projectKey;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async fetchCustomerById(id) {
    this.id = id;

    return process.env.CTP_CUSTOMER_BY_ID_MOCK || customerResponse;
  }

  async updateCustomerById(id, version, actions) {
    this.id = id;
    this.version = version;
    this.actions = actions;

    return process.env.CTP_UPDATE_CUSTOMER_BY_ID_MOCK || updateCustomerResponse;
  }

  async fetchTaxCategoryByIds(ids) {
    this.taxIds = ids;

    return process.env.CTP_TAX_CATEGORY_BY_IDS_MOCK || [];
  }

  async fetchProductsBySkus(skus) {
    this.skus = skus;

    return process.env.CTP_PRODUCTS_BY_SKUS_MOCK || productsResponse;
  }

  async fetchProductsByProductIds(ids) {
    this.ids = ids;

    return process.env.CTP_PRODUCTS_BY_IDS_MOCK || productsResponse;
  }
}

module.exports = { CtpApiClientMockService };
