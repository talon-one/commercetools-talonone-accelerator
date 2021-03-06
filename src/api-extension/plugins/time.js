'use strict';
// @see https://github.com/middyjs/middy/blob/main/plugin/time.js

const defaults = {
  logger: console.log,
};

const timePlugin = (opts = {}) => {
  const { logger } = { ...defaults, ...opts };
  const store = {};

  const start = (action) => {
    store[action] = process.hrtime();
  };

  const stop = (action) => {
    logger({
      name: action,
      time: `${process.hrtime(store[action])[1] / 1000000} ms`,
    });
  };

  const beforePrefetch = () => start('total');
  const requestStart = () => {
    store.init = store.total;
    stop('init');
  };
  const beforeMiddleware = start;
  const afterMiddleware = stop;
  const beforeHandler = () => start('handler');
  const afterHandler = () => stop('handler');
  const requestEnd = () => stop('total');

  return {
    beforePrefetch,
    requestStart,
    beforeMiddleware,
    afterMiddleware,
    beforeHandler,
    afterHandler,
    requestEnd,
  };
};

module.exports = timePlugin;
