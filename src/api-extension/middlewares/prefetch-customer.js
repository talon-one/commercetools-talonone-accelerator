'use strict';

const prefetchCustomerMiddleware = ({ logger, ctpApiClient }) => {
  return {
    before: async function prefetchCustomerMiddlewareBefore({ event, context }) {
      logger.info('prefetchCustomerMiddleware.before').debug([event, context]);

      const customerId = event?.resource?.obj?.customerId;

      if (customerId && context.isCartEvent === true) {
        context.prefetchingCustomer = ctpApiClient().fetchCustomerById(customerId);
      }
    },
  };
};

module.exports = prefetchCustomerMiddleware;
