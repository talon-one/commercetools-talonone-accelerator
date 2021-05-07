'use strict';
const { BootstrapManager, EventType } = require('../models');

const bootstrapMiddleware = ({ logger }) => {
  const getEventType = (event) => {
    return EventType[event?.resource?.typeId] ?? EventType.unknown;
  };
  return {
    before: async function bootstrapMiddlewareBefore({ event, context }) {
      logger.info('checkEventMiddleware.before').test(event, true).debug([event, context]);
      const manager = new BootstrapManager(getEventType(event));

      if (manager.validate(event)) {
        manager.process(event, context, logger);
      }
    },
  };
};

module.exports = bootstrapMiddleware;
