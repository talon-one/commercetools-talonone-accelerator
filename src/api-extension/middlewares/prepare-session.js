'use strict';
const { CustomerSessionFactory } = require('../models');

const prepareSessionMiddleware = ({
  mapperSettings: { lang, payWithPointsAttributeName },
  logger,
  cartAttributeMapping,
  cartItemAttributeMapping,
}) => {
  return {
    before: async function prepareSessionMiddlewareBefore({ event, context }) {
      logger.info('prepareSessionMiddleware.before').debug([event, context]);

      if (context.isCartEvent === true) {
        context.customerSessionV2 = CustomerSessionFactory.constructFromCartEvent(
          event,
          lang,
          cartAttributeMapping,
          cartItemAttributeMapping,
          logger,
          context.currencyCode,
          payWithPointsAttributeName
        );
        logger.test(context.customerSessionV2, true);
      } else if (context.isOrderEvent === true) {
        context.customerSessionV2 = CustomerSessionFactory.constructFromOrderEvent(event);
        logger.test(context.customerSessionV2, true);
      }
    },
  };
};

module.exports = prepareSessionMiddleware;
