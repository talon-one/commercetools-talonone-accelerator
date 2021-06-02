'use strict';
const {
  UPDATE_CUSTOMER_PIPE,
  PREFETCHING_PIPE,
  PREPARE_CONTEXT_PIPE,
} = require('../models/cart-action-factory');
const { CartActionFactory, CustomerActionFactory } = require('../models');

const buildResponseMiddleware = ({ logger, mapperSettings, ctpApiClient }) => {
  return {
    before: async function buildResponseMiddlewareBefore({ event, context }) {
      logger.debug(context, true);

      let actions = [];
      const {
        isCustomerEvent,
        isOrderEvent,
        profileEffects = [],
        sessionEffects = [],
        sessionLoyalty = {},
        isCartEvent,
        currencyCode,
        talonSession = {},
      } = context;
      const obj = event?.resource?.obj ?? {};

      if (isCustomerEvent === true && profileEffects?.length) {
        const factory = new CustomerActionFactory(obj?.custom);

        actions = await factory.createActions(profileEffects);
      } else if (isCartEvent === true) {
        const { customLineItems = [], lineItems = [] } = obj;

        const factory = new CartActionFactory(
          mapperSettings,
          obj,
          talonSession,
          currencyCode,
          lineItems,
          customLineItems,
          ctpApiClient,
          logger,
          sessionLoyalty
        );

        actions = await factory.createActions(sessionEffects);
      } else if (isOrderEvent === true) {
        const { customLineItems = [], lineItems = [] } = obj;

        const factory = new CartActionFactory(
          mapperSettings,
          obj,
          talonSession,
          currencyCode,
          lineItems,
          customLineItems,
          ctpApiClient,
          logger,
          sessionLoyalty
        );

        try {
          await factory.createActions(sessionEffects, [
            PREFETCHING_PIPE,
            PREPARE_CONTEXT_PIPE,
            UPDATE_CUSTOMER_PIPE,
          ]);
        } catch (e) {
          logger.error(e);
        }
      }

      context.response = {
        actions,
        responseType: 'UpdateRequest',
      };

      logger.info(context.response, true);
    },
  };
};

module.exports = buildResponseMiddleware;
