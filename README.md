# commercetools connector

The Talon.One's [commercetools](https://commercetools.com) connector allows you to integrate the Talon.One Promotion Engine into your commercetools Commerce Platform.

- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Creating .env file](#creating-env-file)
  - [Creating Types in Commercetools](#creating-types-in-commercetools)
  - [Creating an API Extension in Commercetools](#creating-an-api-extension-in-commercetools)
  - [Deploying an Application](#deploying-an-application)
  - [Mapping Attributes between commercetools and Talon.One](#mapping-attributes-between-commercetools-and-talonone)
    - [Supported customer commercetools core fields](#supported-customer-commercetools-core-fields)
- [More](#more)

## Requirements

The connector relies on AWS. To use the connector, ensure you have:

- A commercetools Commerce Platform account
- An AWS account with Amazon Lambda
- A Talon.One deployment

## Getting started

Apply all the following sections in sequence to configure and install the connector.

### Installing the tools

1. Install the following tools:

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- [serverless](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
  **Notes:*- To use _serverless_, create an IAM user with minimal privileges.
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

  Example:

  - If `EUR` is received from commercetools and the Talon.One Application uses `PLN` and `USD`, and PLN as fallback, we use turn `EUR` into `PLN`.

  - If the fallback is an empty string, **no data is shared with Talon.One** if the currency doesn't match.

- `TALON_ONE_ATTRIBUTES_MAPPINGS`: Mappings configuration.

- `LANGUAGE`: The default language code used to map information from commercetools to Talon.One. Defaults to `en`.

- `DISCOUNT_TAX_CATEGORY_ID`: Tax category identifier in commercetools applied to discounts from Talon.One.

- `ONLY_VERIFIED_PROFILES`: commercetools will send only profiles with a verified email address.

- `SKU_TYPE`: Determines how the SKU from Talon.One is converted to `SKU_TYPE` in Commercetools. Possible values:
  - `CTP_PRODUCT_ID`: Talon.One SKU to CTP Product ID.
  - `CTP_PRODUCT_ID_WITH_VARIANT_ID`: Talon.One SKU to CTP Product ID and Variant ID. If you choose this, also set `SKU_SEPARATOR`. Defaults to `@`.
  - `CTP_VARIANT_SKU`: Talon.One SKU to CTP SKU.

- `VERIFY_PRODUCT_IDENTIFIERS`: Determines whether to validate SKUs from Talon.One in Commercetools.
  ⚠️ May reduce performance. Possible values: `0` for disabled, `1` for enabled.

- `CART_ATTRIBUTE_MAPPING`, `CART_ITEM_ATTRIBUTE_MAPPING`: [Data mapping specification](./docs/data-mapping-spec.md)

### Creating types in Commercetools

To support Talon.One-specific data, create custom types in Commercetools. Run:

```bash
yarn register-api-types
```

### Creating an API extension in Commercetools

The [API
extension](https://docs.commercetools.com/api/projects/api-extensions#top)
allows us to process the custom types in Commercetools.

To create the required extension, run the following command:

```
yarn register-api-extension
```

The application is ready to be deployed.

#### Managing the extensions

If you run this script again, or if you already have extensions in
Commercetools, you will be prompted to select the one you would like to
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

### Mapping attributes between commercetools and Talon.One

Talon.One requires a specific predefined set of [attributes](https://developers.talon.one/Getting-Started/attributes) which can be sent from commercetools. To specify which attributes should be sent, define a
`TALON_ONE_ATTRIBUTES_MAPPINGS` env variable as a **one-line** JSON object.

Indented example:

```json
{
   "customerProfile":{
      "onlyVerifiedProfiles": true,
      "mappings":{
         "defaultBillingAddressStreetName":"BillingAddress1",
         "defaultBillingAddressCity":"BillingAddress1",
      }
   }
}
```

To see the list of built-in Talon.One attributes, see [Attributes](https://developers.talon.one/Getting-Started/attributes#customer-profile-entity).

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

## More

- [Frontend Integration](docs/frontend-integration.md)
- [Data Mapping Specification](docs/data-mapping-spec.md)
