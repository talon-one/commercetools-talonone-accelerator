# commercetools connector

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](code_of_conduct.md)

The Talon.One's [commercetools](https://commercetools.com) connector allows you to integrate the Talon.One Promotion Engine into your commercetools Commerce Platform.

- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Installing the tools](#installing-the-tools)
  - [Creating the `.env` file](#creating-the-env-file)
  - [Creating types in commercetools](#creating-types-in-commercetools)
  - [Creating the API extension in commercetools](#creating-the-api-extension-in-commercetools)
    - [Managing the extensions](#managing-the-extensions)
  - [Deploying an application](#deploying-an-application)
  - [Testing the integration](#testing-the-integration)
  - [Mapping attributes between commercetools and Talon.One](#mapping-attributes-between-commercetools-and-talonone)
    - [Supported customer commercetools core fields](#supported-customer-commercetools-core-fields)
- [Testing your integration](#testing-your-integration)
- [Related topics](#related-topics)

## Requirements

The connector relies on AWS. To use the connector, ensure you have:

- A commercetools Commerce Platform account
- An AWS account with Amazon Lambda
- A Talon.One deployment

## Getting started

Apply all the following sections in sequence to configure and install the connector.

- [Installing the tools](#installing-the-tools)
- [Creating the `.env` file](#creating-the-env-file)
- [Creating types in commercetools](#creating-types-in-commercetools)
- [Creating the API extension in commercetools](#creating-the-api-extension-in-commercetools)
  - [Managing the extensions](#managing-the-extensions)
- [Deploying an application](#deploying-an-application)
- [Testing the integration](#testing-the-integration)
- [Mapping attributes between commercetools and Talon.One](#mapping-attributes-between-commercetools-and-talonone)
  - [Supported customer commercetools core fields](#supported-customer-commercetools-core-fields)

### Installing the tools

1. Install the following tools:

   - [Yarn](https://yarnpkg.com/getting-started/install)
   - [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
   - [serverless](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)

     **Notes:** To use _serverless_, create an IAM user with minimal privileges.
     See an example in [iam/serverless-dev-iam.sample.json](iam/serverless-dev-iam.sample.json).

1. Check your setup:

   ```bash
   aws sts get-caller-identity
   serverless --version
   ```

### Creating the `.env` file

1. Copy the `.env` sample file from this repository:

   ```bash
   cp .env.sample .env
   ```

1. Edit its content to update the following variables:

   - `CTP_PROJECT_KEY`, `CTP_CLIENT_SECRET`, `CTP_CLIENT_ID`, `CTP_AUTH_URL`,
     `CTP_API_URL`, `CTP_SCOPES`: commercetools API Client Configuration. Create a new API Client with
     scope `manage_project` to get the values.
     See [API Clients](https://docs.commercetools.com/merchant-center/api-clients).

   - `CTP_DEPLOY_TYPE`, `CTP_POST_BODY`: commercetools API Extension configuration parameters.
     See [AWS Lamba](https://docs.commercetools.com/api/projects/api-extensions#aws-lambda-destination).

     To configure `accessKey` and `accessSecret` create another IAM user with minimal
     privileges. See an example in [`iam/ct-dev-iam.sample.json`](iam/ct-dev-iam.sample.json).

   - `TALON_ONE_API_KEY_V1_<currency code>`: Create an API key to get the values:
     See [Creating an API key](https://help.talon.one/hc/en-us/articles/360010114859-Creating-an-API-Key).

     `<currency code>` is the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of your Application.

   - `TALON_ONE_BASE_PATH_<currency code>`: The base URL of your Talon.One deployment. For example: `https://mycompany..europe-west1.talon.one`.

   - `TALON_ONE_FALLBACK_CURRENCY`: One of the currency codes used above or an empty string.
     The fallback is used when the currency from commercetools cannot be matched in Talon.One.

     > Example:
     >
     > - If `EUR` is received from commercetools and the Talon.One Application uses `PLN` and `USD`, and
         PLN as fallback, we use turn `EUR` into `PLN`.
     > - If the fallback is an empty string, **no data is shared with Talon.One** if the currency doesn't match.

   - `LANGUAGE`: The default language code used to map information from commercetools to Talon.One. Defaults to `en`.

   - `DISCOUNT_TAX_CATEGORY_ID`: Tax category identifier in commercetools applied to discounts from Talon.One.
     **Note:** If you are using discounts or coupons in Talon.One, you must set this variable.
     See [details](docs/envs/DISCOUNT_TAX_CATEGORY_ID.md).

   - `ONLY_VERIFIED_PROFILES`: commercetools will send only profiles with a verified email address.

   - `SKU_TYPE`: Determines how the SKU from Talon.One is converted to `SKU_TYPE` in commercetools. Possible values:
     - `CTP_PRODUCT_ID`: Talon.One SKU to CTP Product ID.
     - `CTP_PRODUCT_ID_WITH_VARIANT_ID`: Talon.One SKU to CTP Product ID and Variant ID. If you choose this, also set `SKU_SEPARATOR`. Defaults to `@`.
     - `CTP_VARIANT_SKU`: Talon.One SKU to CTP SKU.

   - `VERIFY_PRODUCT_IDENTIFIERS`: Determines whether to validate SKUs from Talon.One in commercetools.
     ⚠️ May reduce performance. Possible values: `0` for disabled, `1` for enabled.

   - `VERIFY_TAX_IDENTIFIERS`: Determines whether to validate the TAX ID from the lambda configuration in
     commercetools. ⚠️ May reduce performance.  Possible values: `0` (disabled), `1` (enabled).

   - `TALON_ONE_ATTRIBUTES_MAPPINGS`: Determines the mapping between the Talon.One attributes
     and their commercetools equivalents. See [Mapping attributes](#mapping-attributes-between-commercetools-and-talonone).

   - `CART_ATTRIBUTE_MAPPING`, `CART_ITEM_ATTRIBUTE_MAPPING`:
     [Data Mapping Specification](./docs/data-mapping-spec.md)
     [Examples](docs/data-mapping-examples.md)

   - `PAY_WITH_POINTS_ATTRIBUTE_NAME`: The name of the attribute to use to pay with loyalty points (e.g. `PayWithPoints`).

### Creating types in commercetools

To support Talon.One-specific data, create custom types in commercetools. Run:

```bash
yarn register-api-types
```

**Note:** You can see the created types using [Impex](https://docs.commercetools.com/tutorials/#impex) using the `Types` endpoint. The are prefixed by `talon_one`.

### Creating the API extension in commercetools

Register a new [API
extension](https://docs.commercetools.com/api/projects/api-extensions#top)
to process the required custom types in commercetools.

To create the required extension, run the following command:

```bash
yarn register-api-extension
```

**Note:** You can see the created extentions using [Impex](https://docs.commercetools.com/tutorials/#impex) using the `Extensions` endpoint. The function is named `t1-ct-dev-api-extension`.

The application is ready to be deployed.

#### Managing the extensions

If you run this script again, or if you already have extensions in
commercetools, you will be prompted to select the one you would like to
remove.

**This cannot be undone!**

To delete an extension, find the lambda function by following the structure
below and select it:

`arn:aws:lambda:<AWS REGION>:<AWS ACCOUNTID>:function:t1-ct-<STAGE>-api-extension`

**Note:** If you don't remove the redundant function, all registered functions will be run
every time you call the commercetools API related to those API Extensions.

### Deploying an application

To deploy the lambda function to your AWS setup, run:

```bash
yarn deploy [--stage stage]
```

**Note:** By default, `stage` is set to `dev`.

When the application is deployed, you can call the Lambda function and check the logs:

```bash
yarn api-extension:invoke
yarn api-extension:logs
```

### Testing the integration

You can use [Impex](https://docs.commercetools.com/tutorials/#impex)'s GraphiQL tool to run the following query:

```js
mutation{
  createCart (draft: {
    currency: "EUR"
  }) {
    custom {
      customFieldsRaw {
        name
        value
      }
    }
  }
}
```

It should return a `talon_one_cart_notifications` custom field with a message saying the integration is ready.

For more GraphQL queries, see [Frontend integration](docs/frontend-integration.md).

### Mapping attributes between commercetools and Talon.One

You can create custom
[attributes](https://help.talon.one/hc/en-us/articles/360010028740-Creating-Attributes) in
Talon.One to represent any data you require to manage your promotions.

This connector supports a list of
[commercetools customer core fields](#supported-customer-commercetools-core-fields). Map the ones you
need to their Talon.One equivalents that you created.

To define the mapping, use the `TALON_ONE_ATTRIBUTES_MAPPINGS` env variable as a **one-line** JSON object.

**Indented example:**

For example, if you have a custom attribute in Talon.One called
`shippingAddressStreet`, you can map the address of a customer from
commercetools with the following JSON:

```json
{
   "customerProfile":{
      "onlyVerifiedProfiles": true,
      "mappings":{
         "defaultShippingAddressStreetName":"shippingAddressStreet",
      }
   }
}
```

#### Supported customer commercetools core fields

- `id`
- `email`
- `firstName`
- `lastName`
- `name`
- `createdAt`
- `customerNumber`
- `middleName`
- `title`
- `salutation`
- `dateOfBirth`
- `companyName`
- `vatId`
- `defaultShippingAddressId`
- `defaultBillingAddressId`
- `externalId`
- `isEmailVerified`
- `defaultBillingAddressTitle`
- `defaultBillingAddressSalutation`
- `defaultBillingAddressFirstName`
- `defaultBillingAddressLastName`
- `defaultBillingAddressStreetName`
- `defaultBillingAddressStreetNumber`
- `defaultBillingAddressAdditionalStreetInfo`
- `defaultBillingAddressPostalCode`
- `defaultBillingAddressCity`
- `defaultBillingAddressRegion`
- `defaultBillingAddressState`
- `defaultBillingAddressCountry`
- `defaultBillingAddressCompany`
- `defaultBillingAddressDepartment`
- `defaultBillingAddressBuilding`
- `defaultBillingAddressApartment`
- `defaultBillingAddressPOBox`
- `defaultBillingAddressPhone`
- `defaultBillingAddressMobile`
- `defaultBillingAddressEmail`
- `defaultBillingAddressFax`
- `defaultBillingAddressAdditionalAddressInfo`
- `defaultShippingAddressTitle`
- `defaultShippingAddressSalutation`
- `defaultShippingAddressFirstName`
- `defaultShippingAddressLastName`
- `defaultShippingAddressStreetName`
- `defaultShippingAddressStreetNumber`
- `defaultShippingAddressAdditionalStreetInfo`
- `defaultShippingAddressPostalCode`
- `defaultShippingAddressCity`
- `defaultShippingAddressRegion`
- `defaultShippingAddressState`
- `defaultShippingAddressCountry`
- `defaultShippingAddressCompany`
- `defaultShippingAddressDepartment`
- `defaultShippingAddressBuilding`
- `defaultShippingAddressApartment`
- `defaultShippingAddressPOBox`
- `defaultShippingAddressPhone`
- `defaultShippingAddressMobile`
- `defaultShippingAddressEmail`
- `defaultShippingAddressFax`
- `defaultShippingAddressAdditionalAddressInfo`

## Testing your integration

Once you have configured the connector, you can test the integration by:

1. Enabling your connected Application's campaign in Talon.One.
1. Trigger a data transfer to Talon.One, for example by creating a cart in your e-commerce platform.
1. Check the API logs in Talon.One to check the data you received by clicking
   **Account** > **Dev Tools** > **Integration API Log**.

## Related topics

- [Frontend Integration](docs/frontend-integration.md)
- [Data Mapping Specification](docs/data-mapping-spec.md)
- [API docs](docs/API.md)

## Contributing  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

If you are using commercetools <-> Talon.One Connector, found a bug or have an idea how to improve it, please read our [Contributing Guidelines](https://github.com/talon-one/commercetools-talonone-connector/blob/master/.github/CONTRIBUTING.md) first and follow them.

You can follow the [list of open and active issues](https://github.com/talon-one/commercetools-talonone-connector/issues) or contact us directly under [opensource@talon.one](mailto:opensource@talon.one).

## Code of Conduct

We have adopted a [Code of Conduct](https://github.com/talon-one/commercetools-talonone-connector/blob/master/CODE_OF_CONDUCT.md) that we expect project participants to adhere to. Please read the full text so that you can understand what actions will and will not be tolerated as part of your activity in this community.
