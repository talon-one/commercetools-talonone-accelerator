'use strict';
const {
  CartActionsMapper,
  CartActionFactory,
  CustomerActionFactory,
  REFERRAL_CREATED_PIPE,
} = require('../models');

const buildResponseMiddleware = ({ logger, mapperSettings, ctpApiClient }) => {
  return {
    before: async function buildResponseMiddlewareBefore({ event, context }) {
      logger.info('buildResponseMiddleware.before').debug(context);

      let actions = [];
      const { talonSession = {} } = context ?? {};

      if (context.isCustomerEvent === true && Array.isArray(context.profileEffects)) {
        const factory = new CustomerActionFactory(event.resource.obj.custom);
        actions = await factory.createActions(context.profileEffects);
      } else if (context.isCartEvent === true) {
        const { customLineItems = [], lineItems = [] } = event.resource.obj;

        const factory = new CartActionFactory(
          mapperSettings,
          event.resource.obj,
          talonSession,
          context.currencyCode
        );

        const mapper = new CartActionsMapper(
          mapperSettings,
          lineItems,
          customLineItems,
          ctpApiClient,
          logger
        );

        const processEffects = (effects) => {
          logger.test(['processEffects', effects]);

          for (const effect of effects) {
            if (effect?.effectType && effect?.props) {
              let triggeredByCoupon = null;

              if (effect?.triggeredByCoupon) {
                const matchedAcceptCouponEffect = effects.filter(
                  (item) =>
                    item.effectType === 'acceptCoupon' &&
                    item.triggeredByCoupon === effect.triggeredByCoupon
                );

                if (matchedAcceptCouponEffect.length === 1) {
                  triggeredByCoupon = matchedAcceptCouponEffect[0].props.value;
                }
              }

              actions = [
                ...actions,
                ...factory.constructFromEffect(effect.effectType, effect.props, triggeredByCoupon),
              ];
            }
          }
        };

        if (Array.isArray(context.sessionEffects)) {
          processEffects(context.sessionEffects);
        }

        actions = await mapper.process(actions);

        // referrals
        const customerId = event?.resource?.obj?.customerId;
        logger.test('customerId').test(customerId);

        if (customerId) {
          const customer = await context.prefetchingCustomer;
          logger.test('customer').test(customer);

          if (customer?.version) {
            const customerFactory = new CustomerActionFactory(customer?.custom);

            context.customerUpdateActions = await customerFactory.createActions(
              context.sessionEffects,
              [],
              [REFERRAL_CREATED_PIPE]
            );

            logger.test('customerUpdateActions').test(context.customerUpdateActions, true);

            if (context.customerUpdateActions) {
              const result = await ctpApiClient().updateCustomerById(
                customerId,
                customer.version,
                context.customerUpdateActions
              );

              logger.test('updateCustomerById').test(result, true);
            }
          }
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
