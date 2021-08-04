'use strict';

const { Env } = require('./env');

class GoogleTestWrapper {
  constructor(mod) {
    this.mod = mod;
  }

  async run(event) {
    let actions = [];

    const env = new Env();
    const token = Buffer.from(
      `${env.getBasicAuthUsername()}:${env.getBasicAuthPassword()}`
    ).toString('base64');

    await this.mod.handler(
      {
        body: event,
        get(key) {
          switch (key) {
            case 'authorization':
              return `Basic ${token}`;

            default:
              return '';
          }
        },
      },
      {
        status() {
          return {
            json(response) {
              actions = response.actions;
            },
          };
        },
      }
    );

    return {
      actions,
      responseType: 'UpdateRequest',
    };
  }
}

module.exports = { GoogleTestWrapper };
