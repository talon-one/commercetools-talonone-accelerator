'use strict';
const { AppBuilder, Env } = require('./models');
const { main } = require('./main');
const m = require('./middlewares');

const env = new Env();
const builder = new AppBuilder(
  main,
  env.getLoggerService(),
  env.getProvider(),
  env.getBasicAuthUsername(),
  env.getBasicAuthPassword()
);
const handler = builder
  .setMapperSettings(env.getMapperSettings())
  .setApiClient(env.getApiClient())
  .setCtpApiClient(env.getCtpApiClient())
  .setBroadcastApiClient(env.getBroadcastApiClient())
  .setAttributeMappings(env.getAttributeMappings())
  .setCartAttributeMapping(env.getCartAttributeMapping())
  .setCartItemAttributeMapping(env.getCartItemAttributeMapping())
  .setEventValidationMode(env.getEventValidationMode())
  .use(m.bootstrap)
  .use(m.prepareProfile)
  .use(m.updateProfile)
  .use(m.prepareSession)
  .use(m.updateSession)
  .use(m.buildResponse);

if (env.isUnitTest()) {
  handler.use(m.unitTest);
}

module.exports = { handler: handler.build() };
