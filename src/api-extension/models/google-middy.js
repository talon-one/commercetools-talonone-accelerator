'use strict';

function googleMiddy(handler, username, password) {
  const middlewares = [];

  async function main(request, response) {
    const event = request?.body;
    const context = {};

    try {
      const authToken = request.get('authorization').split(' ')[1];
      const token = Buffer.from(`${username}:${password}`).toString('base64');

      if (token !== authToken) {
        throw new Error();
      }
    } catch (e) {
      throw new Error('Access denied.');
    }

    for (const middleware of middlewares) {
      try {
        await middleware?.before({ event, context });
      } catch (e) {
        // ignore
      }
    }

    context.response = await handler(event, context);

    for (const middleware of middlewares) {
      try {
        await middleware?.after({ event, context });
      } catch (e) {
        // ignore
      }
    }

    response.status(200).json({ actions: context.response?.actions });
  }

  function use(middleware) {
    middlewares.push(middleware);
  }

  return {
    main,
    use,
  };
}

module.exports = { googleMiddy };
