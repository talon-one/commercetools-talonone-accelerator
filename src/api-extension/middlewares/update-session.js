'use strict';
const { NewCustomerSessionV2 } = require('talon_one');

const updateSessionMiddleware = ({ apiClient, logger }) => {
  return {
    before: async function updateSessionMiddlewareBefore({ context }) {
      logger.info('updateSessionMiddleware.before').debug(context);

      if (!context?.customerSessionV2) {
        return;
      }

      const {
        customerSessionV2: { id, payload },
      } = context;

      logger.debug([id, payload], true);

      if (!(payload instanceof NewCustomerSessionV2) || !id) {
        logger.info('Skipping session updates...');
        return;
      }

      try {
        const data = await apiClient(context.currencyCode).updateCustomerSession(id, payload);

        logger.test('updateCustomerSessionV2.data').test(data, true);
        context.sessionEffects = data?.effects?.map((e) => ({ ...e, fromApi: data.fromApi })) || [];
        context.sessionLoyalty = data?.loyalty || {};
        context.talonSession = data?.customerSession || [];
      } catch (err) {
        logger.error(err);
      }
    },
  };
};

module.exports = updateSessionMiddleware;
