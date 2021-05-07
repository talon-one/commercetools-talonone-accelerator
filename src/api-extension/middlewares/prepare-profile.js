'use strict';
const { CustomerProfileFactory } = require('../models');

const prepareProfileMiddleware = ({
  mapperSettings,
  logger,
  attributeMappings: { customerProfile },
}) => {
  return {
    before: async function prepareProfileMiddlewareBefore({ event, context }) {
      logger.info(['prepareProfileMiddleware.before', mapperSettings]).debug([event, context]);

      if (context.isCustomerEvent === true) {
        context.customerProfileV2 = CustomerProfileFactory.constructFromCustomerEvent(
          event,
          customerProfile
        );
        logger.test(context.customerProfileV2, true);
      }
    },
  };
};

module.exports = prepareProfileMiddleware;
