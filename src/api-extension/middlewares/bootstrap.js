'use strict';
const { BootstrapManager, EventType } = require('../models');

const eventType = (event) => {
  return EventType[event?.resource?.typeId?.toUpperCase()] ?? EventType.UNKNOWN;
};

const bootstrapMiddleware = ({ logger, eventValidationMode }) => {
  return {
    before: async function bootstrapMiddlewareBefore({ event, context }) {
      logger.test(event, true).debug([event, context]);

      const manager = new BootstrapManager(eventType(event), eventValidationMode, logger);

      if (manager.validate(event)) {
        manager.process(event, context);
      }
    },
  };
};

module.exports = bootstrapMiddleware;
