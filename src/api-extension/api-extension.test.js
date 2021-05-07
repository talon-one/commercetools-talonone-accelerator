'use strict';
const {
  emptyEvent,
  createCartEvent,
  updateCartEvent,
  createCustomerEvent,
  updateCustomerEvent,
  createOrderEvent,
  updateOrderEvent,
  updateCartActions,
  updateCustomerSessionResponse,
  updateCartEventCustomerSession,
  createCartReferralActions,
  createCustomerReferralActions,
  eurReferralsResponse,
  usdReferralsResponse,
  createCartUpdateCustomerReferralActions,
} = require('./mocks');

const jestPlugin = require('serverless-jest-plugin');

function setupEnv(env = {}) {
  process.env.UNIT_TEST = 1;
  process.env.LOGGER_MODE = 'NONE';
  process.env.TALON_ONE_ATTRIBUTES_MAPPINGS = '{"customerProfile":{"mappings":{"name":"Name"}}}';
  process.env.LANGUAGE = 'en';
  process.env.DISCOUNT_TAX_CATEGORY_ID = '3b52cdd8-c767-4c98-923f-a269e01a6ff2';
  process.env.SKU_TYPE = 'CTP_VARIANT_SKU';
  process.env.SKU_SEPARATOR = '@';
  process.env.VERIFY_PRODUCT_IDENTIFIERS = '1';
  process.env = { ...process.env, ...env };

  jest.resetModules();
  const mod = require('./index');

  return jestPlugin.lambdaWrapper.wrap(mod, { handler: 'handler' });
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function reindex(array) {
  return array.filter((val) => val);
}

describe('api-extension', () => {
  it('create cart event', () => {
    return setupEnv()
      .run(createCartEvent)
      .then((response) => {
        expect(response).toBeDefined();
      });
  });

  it('update cart event', () => {
    const out = deepClone(updateCartActions);
    delete out.actions[0];
    out.actions = reindex(out.actions);

    return setupEnv()
      .run(updateCartEvent)
      .then((response) => {
        expect(response).toBeDefined();
        expect(response).toEqual(out);
      });
  });

  it('update cart event with CTP_PRODUCT_ID', () => {
    const session = deepClone(updateCustomerSessionResponse);
    session.effects[2].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378';
    session.effects[3].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378';
    session.effects[4].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378';

    const out = deepClone(updateCartActions);
    delete out.actions[0];
    out.actions = reindex(out.actions);

    delete out.actions[6];
    delete out.actions[11].sku;
    out.actions[11].productId = 'e47852f8-9044-483d-84dd-8c42eb493378';
    out.actions[11].quantity = 3;
    out.actions = reindex(out.actions);

    return setupEnv({
      SKU_TYPE: 'CTP_PRODUCT_ID',
      CUSTOMER_SESSION_MOCK: session,
    })
      .run(updateCartEvent)
      .then((response) => {
        expect(response).toEqual(out);
      });
  });

  it('update cart event with CTP_PRODUCT_ID_WITH_VARIANT_ID (1)', () => {
    const session = deepClone(updateCustomerSessionResponse);
    session.effects[2].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378';
    session.effects[3].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378';
    session.effects[4].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378';

    const out = deepClone(updateCartActions);
    delete out.actions[0];
    out.actions = reindex(out.actions);

    delete out.actions[6];
    delete out.actions[11].sku;
    out.actions[11].productId = 'e47852f8-9044-483d-84dd-8c42eb493378';
    out.actions[11].variantId = 1;
    out.actions[11].quantity = 3;
    out.actions = reindex(out.actions);

    return setupEnv({
      SKU_TYPE: 'CTP_PRODUCT_ID_WITH_VARIANT_ID',
      CUSTOMER_SESSION_MOCK: session,
    })
      .run(updateCartEvent)
      .then((response) => {
        expect(response).toEqual(out);
      });
  });

  it('update cart event with CTP_PRODUCT_ID_WITH_VARIANT_ID (2)', () => {
    const session = deepClone(updateCustomerSessionResponse);
    session.effects[2].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378@2';
    session.effects[3].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378@2';
    session.effects[4].props.sku = 'e47852f8-9044-483d-84dd-8c42eb493378@1';

    const out = deepClone(updateCartActions);
    delete out.actions[0];
    out.actions = reindex(out.actions);

    delete out.actions[6].sku;
    delete out.actions[11].sku;
    out.actions[6].productId = 'e47852f8-9044-483d-84dd-8c42eb493378';
    out.actions[6].variantId = 1;
    out.actions[11].productId = 'e47852f8-9044-483d-84dd-8c42eb493378';
    out.actions[11].variantId = 2;

    return setupEnv({
      SKU_TYPE: 'CTP_PRODUCT_ID_WITH_VARIANT_ID',
      CUSTOMER_SESSION_MOCK: session,
    })
      .run(updateCartEvent)
      .then((response) => {
        expect(response).toEqual(out);
      });
  });

  it('update cart event without notifications', () => {
    const session = deepClone(updateCustomerSessionResponse);
    for (let i = 5; i <= 12; i++) {
      delete session.effects[i];
    }

    session.effects = reindex(session.effects);

    const out = deepClone(updateCartActions);
    [8, 9, 11].map((i) => delete out.actions[i]);
    out.actions = reindex(out.actions);

    return setupEnv({
      CUSTOMER_SESSION_MOCK: session,
    })
      .run(updateCartEvent)
      .then((response) => {
        expect(response).toBeDefined();
        expect(response).toEqual(out);
      });
  });

  it('update cart event with invalid effects', () => {
    const session = deepClone(updateCustomerSessionResponse);
    for (let i = 5; i <= 12; i++) {
      delete session.effects[i];
    }

    const out = deepClone(updateCartActions);
    [8, 9, 11].map((i) => delete out.actions[i]);
    out.actions = reindex(out.actions);

    return setupEnv({
      CUSTOMER_SESSION_MOCK: session,
    })
      .run(updateCartEvent)
      .then((response) => {
        expect(response).toBeDefined();
        expect(response).toEqual(out);
      });
  });

  it('create customer event', () => {
    return setupEnv()
      .run(createCustomerEvent)
      .then((response) => {
        expect(response).toBeDefined();
      });
  });

  it('update customer event', () => {
    return setupEnv()
      .run(updateCustomerEvent)
      .then((response) => {
        expect(response).toBeDefined();
      });
  });

  it('create order event', () => {
    return setupEnv()
      .run(createOrderEvent)
      .then((response) => {
        expect(response).toBeDefined();
      });
  });

  it('update order event', () => {
    return setupEnv()
      .run(updateOrderEvent)
      .then((response) => {
        expect(response).toBeDefined();
      });
  });

  it('empty event', () => {
    return setupEnv()
      .run(emptyEvent)
      .then((response) => {
        expect(response).toBeDefined();
      });
  });

  it('api credentials without currency fallback', () => {
    const out = deepClone(updateCartActions);
    for (let i = 5; i <= 12; i++) {
      delete out.actions[i];
    }
    out.actions = reindex(out.actions);

    return setupEnv({
      UNIT_TEST: 0,
      TALON_ONE_FALLBACK_CURRENCY: '',
      TALON_ONE_API_KEY_V1_USD: 'fake-key',
      TALON_ONE_API_BASE_PATH_USD: 'fake-path',
      TALON_ONE_API_KEY_V1_EUR: undefined,
      TALON_ONE_API_BASE_PATH_EUR: undefined,
    })
      .run(updateCartEvent)
      .then((response) => {
        const { LoggerService } = require('./services/logger');
        const logger = new LoggerService();
        expect(response).toEqual(out);
        expect(logger.getLastError().message).toEqual('Invalid currency code.');
      });
  });

  it('api credentials with currency fallback', () => {
    const out = deepClone(updateCartActions);
    for (let i = 5; i <= 12; i++) {
      delete out.actions[i];
    }
    out.actions = reindex(out.actions);

    return setupEnv({
      UNIT_TEST: 0,
      TALON_ONE_FALLBACK_CURRENCY: 'USD',
      TALON_ONE_API_KEY_V1_USD: 'fake-key',
      TALON_ONE_API_BASE_PATH_USD: 'fake-path',
      TALON_ONE_API_KEY_V1_EUR: undefined,
      TALON_ONE_API_BASE_PATH_EUR: undefined,
    })
      .run(updateCartEvent)
      .then((response) => {
        const { LoggerService } = require('./services/logger');
        const logger = new LoggerService();
        expect(response).toEqual(out);
        expect(logger.getLastError().error.message).toEqual('getaddrinfo ENOTFOUND fake-path');
      });
  });

  it('create customer event with referrals', () => {
    return setupEnv({
      TALON_ONE_API_KEY_V1_EUR: 'EUR',
      TALON_ONE_API_BASE_PATH_EUR: 'EUR',
      TALON_ONE_API_KEY_V1_USD: 'USD',
      TALON_ONE_API_BASE_PATH_USD: 'USD',
      PROFILE_USD_MOCK: usdReferralsResponse,
      PROFILE_EUR_MOCK: eurReferralsResponse,
    })
      .run(createCustomerEvent)
      .then((response) => {
        expect(response).toEqual(createCustomerReferralActions);
      });
  });

  it('create cart event with referrals', () => {
    return setupEnv({
      TALON_ONE_API_KEY_V1_EUR: 'EUR',
      TALON_ONE_API_BASE_PATH_EUR: 'EUR',
      TALON_ONE_API_KEY_V1_USD: 'USD',
      TALON_ONE_API_BASE_PATH_USD: 'USD',
      SESSION_USD_MOCK: usdReferralsResponse,
      SESSION_EUR_MOCK: eurReferralsResponse,
    })
      .run(createCartEvent)
      .then((response) => {
        expect(response).toEqual(createCartReferralActions);
        expect(process.env.__REQUEST.context.customerUpdateActions).toEqual(
          createCartUpdateCustomerReferralActions
        );
      });
  });

  it('data mapping', () => {
    return setupEnv({
      CART_ATTRIBUTE_MAPPING:
        'color.label:t1_01{dates}; color.label.x5:t1_02{time}; color.label.x3:t1_03{location}; color.label:t1_04{locations}; color.key:t1_05{numbers}; color.label:t1_06{numbers}; color.label.x0:t1_07{number}; color.label.x7:t1_08{boolean}; color.key:t1_09; color.label:t1_10{strings}; color.label{it,de}:t1_11{strings}; color.label{de,it}:t1_12{strings}; color.label.de:t1_13; color:t1_14; color.label.x3.x:t1_15',
      CART_ITEM_ATTRIBUTE_MAPPING:
        'color.label:t1_01{dates}; color.label.x5:t1_02{time}; color.label.x3:t1_03{location}; color.label:t1_04{locations}; color.key:t1_05{numbers}; color.label:t1_06{numbers}; color.label.x0:t1_07{number}; color.label.x7:t1_08{boolean}; color.key:t1_09; color.label:t1_10{strings}; color.label{it,de}:t1_11{strings}; color.label{de,it}:t1_12{strings}; color.label.de:t1_13; color:t1_14; color.label.x3.x:t1_15',
    })
      .run(updateCartEvent)
      .then(() => {
        expect(process.env.__REQUEST.context.customerSessionV2).toEqual(
          updateCartEventCustomerSession
        );
      });
  });
});
