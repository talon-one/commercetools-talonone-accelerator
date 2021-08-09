'use strict';
const inquirer = require('inquirer');
const Plugin = require('./plugin');
const requestBuilder = require('@commercetools/api-request-builder');

const NONE_CHOICE = 'None';
const CT_AWS_DESTINATION_TYPE = 'AWSLambda';
const CT_HTTP_DESTINATION_TYPE = 'HTTP';

class RegisterApiExtensionPlugin extends Plugin {
  constructor(serverless, options) {
    super(serverless, options);

    this.commands = {
      'register-api-extension': {
        usage: 'Create commercetools API Extension',
        lifecycleEvents: ['execute'],
      },
    };

    this.hooks = {
      'register-api-extension:execute': this.execute.bind(this),
    };
  }

  /**
   * @param {number} perPage - The maximum value is 500.
   * @returns {Promise<*>}
   */
  async fetchExtensions(perPage = 500) {
    const projectKey = this.projectKey;
    const client = await this.getClient();
    this.serverless.cli.log(`Fetching extensions for project: ${projectKey}`);

    const url = requestBuilder
      .createRequestBuilder({ projectKey })
      .extensions.withTotal()
      .perPage(perPage)
      .build();

    const request = {
      uri: url,
      method: 'GET',
    };
    return client.execute(request);
  }

  async deleteExtensionsById({ id, version }) {
    const projectKey = this.projectKey;
    const client = await this.getClient();
    this.serverless.cli.log(`Deleting extension: ${id} (version: ${version})`);

    const url = requestBuilder
      .createRequestBuilder({ projectKey })
      .extensions.byId(id)
      .withVersion(version)
      .build();

    const request = {
      uri: url,
      method: 'DELETE',
    };
    return client.execute(request);
  }

  async execute() {
    const {
      body: { results = [] },
    } = await this.fetchExtensions();

    const choices = [];
    const extensions = {};

    for (const { id, version, destination = {} } of results) {
      switch (destination.type) {
        case CT_AWS_DESTINATION_TYPE:
          choices.push(`${destination.arn}`);
          extensions[destination.arn] = { id, version };
          break;

        case CT_HTTP_DESTINATION_TYPE:
          choices.push(`${destination.url}`);
          extensions[destination.url] = { id, version };
          break;

        default:
          break;
      }
    }

    if (choices.length) {
      choices.push(NONE_CHOICE);
      await inquirer
        .prompt([
          {
            type: 'list',
            name: 'ext',
            message: 'Choose the extension, that you want to delete:',
            choices,
          },
        ])
        .then(({ ext }) => {
          if (ext && ext !== NONE_CHOICE) {
            this.deleteExtensionsById(extensions[ext]);
          }
        });
    }

    await this.serverlessCommercetoolsPlugin.afterDeploy();
  }
}

module.exports = RegisterApiExtensionPlugin;
