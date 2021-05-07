'use strict';
const { NewCustomerProfile } = require('talon_one');

const updateProfileMiddleware = ({ broadcastApiClient, logger }) => {
  return {
    before: async function updateProfileMiddlewareBefore({ context }) {
      logger.info('updateProfileMiddleware.before').debug(context);

      if (!context?.customerProfileV2) {
        return;
      }

      const {
        customerProfileV2: { id, payload },
      } = context;

      if (!(payload instanceof NewCustomerProfile) || !id) {
        logger.info('Skipping profile updates...');
        return;
      }

      try {
        const data = await broadcastApiClient().updateCustomerProfile(id, payload);

        logger.test('updateCustomerProfileV2.data').test(data, true);
        context.profileEffects = [];

        if (Array.isArray(data)) {
          for (const result of data) {
            if (result.effects) {
              context.profileEffects = [
                ...context.profileEffects,
                ...result.effects.map((e) => ({ ...e, fromApi: result.fromApi })),
              ];
            }
          }
        }
      } catch (err) {
        logger.error(err);
      }
    },
  };
};

module.exports = updateProfileMiddleware;
