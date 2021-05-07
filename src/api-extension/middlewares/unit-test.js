'use strict';

const unitTestMiddleware = () => {
  return {
    before: async (request) => {
      process.env.__REQUEST = request;
    },
  };
};

module.exports = unitTestMiddleware;
