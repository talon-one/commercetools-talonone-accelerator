'use strict';
const Plugin = require('./plugin');
const inquirer = require('inquirer');
const requestBuilder = require('@commercetools/api-request-builder');
const { CustomerEventMapper } = require('../api-extension/models/customer-event-mapper.js');
const fs = require('fs');
const { Env } = require('../api-extension/models/env');

const FILEPATH = '.migration';

const FRESH_CHOICE = 'fresh';
const CONTINUE_CHOICE = 'continue';

class MigrateCustomerProfiles extends Plugin {
  constructor(serverless, options) {
    super(serverless, options);

    ({ MIGRATION_BATCH_SIZE: this.batchSize } = this.serverless.service.provider.environment);

    this.commands = {
      'migrate-customer-profiles': {
        usage: 'Migrate commercetools customer to Talon.One',
        lifecycleEvents: ['execute'],
      },
    };

    this.hooks = {
      'migrate-customer-profiles:execute': this.execute.bind(this),
    };
  }

  /**
   * @param {number} page - Current page.
   * @param {boolean} onlyVerifiedProfiles - push only verified customers.
   * @returns {Promise<*>}
   */
  async fetchCustomers(page, onlyVerifiedProfiles) {
    const projectKey = this.projectKey;
    const client = await this.getClient();
    const batchSize = parseInt(this.batchSize, 10);
    this.serverless.cli.log(`Fetching customers for project: ${projectKey}`);

    let url = requestBuilder
      .createRequestBuilder({ projectKey })
      .customers.page(page)
      .perPage(batchSize)
      .build();

    if (onlyVerifiedProfiles) {
      url = requestBuilder
        .createRequestBuilder({ projectKey })
        .customers.where('isEmailVerified = true')
        .page(page)
        .perPage(batchSize)
        .build();
    }

    const request = {
      uri: url,
      method: 'GET',
    };

    return client.execute(request);
  }

  /**
   * @return {number}
   */
  getPage() {
    let pageNumber = 1;

    if (fs.existsSync(FILEPATH)) {
      pageNumber = parseInt(fs.readFileSync(FILEPATH, 'utf8'), 10);

      if (pageNumber < 1) {
        pageNumber = 1;
      }
    }

    return pageNumber;
  }

  async execute() {
    const env = new Env();
    const broadcastApiClient = env.getBroadcastApiClient();
    const attributeMappings = JSON.parse(this.talonAttributesMappings);

    let page = this.getPage();

    if (page > 1) {
      await inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'Choose action which you want to perform:',
            choices: [FRESH_CHOICE, CONTINUE_CHOICE],
          },
        ])
        .then((answers) => {
          if (answers.action === FRESH_CHOICE) {
            page = 1;
          }
        });
    }

    let records = 0;

    do {
      const {
        body: { results = [] },
      } = await this.fetchCustomers(page, attributeMappings.customerProfile.onlyVerifiedProfiles);

      records = results.length;

      if (records === 0) {
        break;
      }

      this.serverless.cli.log(`Processing ${records} customers for page  ${page}`);

      const customerProfiles = [];

      for (const profile of results) {
        const customerProfileMapper = new CustomerEventMapper(profile.id, profile, {
          mappings: attributeMappings.customerProfile.mappings,
        });

        const customerProfile = {
          integrationId: customerProfileMapper.getProfileIntegrationId(),
          attributes: customerProfileMapper.mapAttributes(),
        };

        customerProfiles.push(customerProfile);
      }

      const payload = {
        customerProfiles,
      };

      await broadcastApiClient().updateCustomerProfiles(payload);

      page++;
      fs.writeFileSync(FILEPATH, page.toString());
    } while (records > 0);

    this.serverless.cli.log('Customers not found. Ending...');
  }
}

module.exports = MigrateCustomerProfiles;
