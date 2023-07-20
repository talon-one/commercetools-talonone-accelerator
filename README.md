# commercetools accelerator

[![✅ Tests](https://github.com/talon-one/commercetools-talonone-accelerator/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/talon-one/commercetools-talonone-accelerator/actions/workflows/test.yml) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](CODE_OF_CONDUCT.md)

The Talon.One's [commercetools](https://commercetools.com) accelerator allows you to integrate the Talon.One Promotion Engine into your commercetools Commerce Platform.

**Important:** This commercetools accelerator is experimental and is best suited for use in proof-of-concept or simulation projects, not in production environments.

- [commercetools accelerator](#commercetools-accelerator)
  - [Requirements](#requirements)
  - [Capabilities](#capabilities)
  - [Getting started](#getting-started)
    - [Installing the tools](#installing-the-tools)
    - [Creating the `.env` file](#creating-the-env-file)
    - [Choosing the platform](#choosing-the-platform)
      - [Using AWS](#using-aws)
      - [Using GCP](#using-gcp)
        - [Example](#example)
    - [Editing the shared variables](#editing-the-shared-variables)
    - [Creating types in commercetools](#creating-types-in-commercetools)
    - [Creating the API extension in commercetools](#creating-the-api-extension-in-commercetools)
      - [Deleting an extension](#deleting-an-extension)
    - [Deploying an application](#deploying-an-application)
    - [Mapping attributes between commercetools and Talon.One](#mapping-attributes-between-commercetools-and-talonone)
  - [Testing your integration](#testing-your-integration)
  - [Related topics](#related-topics)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)

## Requirements

The accelerator relies on AWS or GCP. To use the accelerator, ensure you have:

- A commercetools Commerce Platform account
- An AWS account with Amazon Lambda **OR** a Google Cloud Platform account
- A Talon.One deployment with at least one enabled campaign with one test rule. Example: Always trigger a notification.

## Capabilities

The accelerator covers the following use cases and effects:

|                      |                             Action/Effects                              |     Possibility      |
| -------------------- | ----------------------------------------------------------------------- | -------------------- |
| **Customer Profile** | Create (Registration/Login)                                             | YES                  |
|                      | Update (only supported fields)                                          | YES                  |
| **Cart Activity**    | Free Item (Product ID, Variant SKU, Product ID + Variant SKU)           | YES                  |
|                      | Cart level discount                                                     | YES                  |
|                      | Per item discount                                                       | YES                  |
|                      | Notifications                                                           | YES                  |
| **Coupons**          | Single coupon discount                                                  | YES                  |
|                      | Multiple coupon discount                                                |                      |
|                      | Create coupon code                                                      |                      |
|                      | Accept Coupon                                                           | YES                  |
|                      | RejectCoupon                                                            | YES                  |
| **Referral Codes**   | Create Referral Code                                                    | YES                  |
|                      | AcceptReferral                                                          | YES                  |
|                      | RejectReferral                                                          | YES                  |
| **Loyalty**          | Addition of points                                                      | YES                  |
|                      | Deduction of points                                                     | YES                  |
|                      | Paying with points                                                      | YES                  |
| **Additional**       | Cart Item Flattening - Disabled                                         |                      |
|                      | Cart Item Flattening - Enabled                                          |                      |
|                      | Custom Cart Level attributes                                            | DEVELOPMENT REQUIRED |
|                      | Custom Customer Profile attributes                                      | DEVELOPMENT REQUIRED |
|                      | Multiple Talon.One Apps supportability                                  |                      |
|                      | Specifying T1 App ID from CT cart object                                |                      |
|                      | Dynamic T1 App ID from CT cart object                                   |                      |
|                      | Cascading discounts                                                     |                      |
|                      | Strike though pricing                                                   |                      |
| **Session States**   | Set to Open once a product is added to the cart                         | YES                  |
|                      | Set to Closed when payment is complete                                  | YES                  |
|                      | Cannot set to Closed when payment is not successful (eg Payment Failed) | YES                  |
|                      | Set to Cancelled when order is returned                                 | YES                  |
|                      | Effects Rollback on Order cancellation                                  | YES                  |

See the available effects in the [Talon.One documentation](https://docs.talon.one/docs/product/rules/effects/available-effects/).

## Getting started

Apply all the following sections in sequence to configure and install the accelerator.

### Installing the tools

1. Install the following tools:

   - [Yarn](https://yarnpkg.com/getting-started/install)
   - [serverless](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
   - If using AWS, [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

1. To use _serverless_:

   - For AWS: Create an IAM user with minimal privileges.

     See an example in [iam/serverless-dev-iam.sample.json](iam/serverless-dev-iam.sample.json)
     and see the [serverless AWS documentation](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)

   - For GCP: Create a service account with appropriate roles and download the JSON file with credentials.

     See the  [serveless GCP documentation](https://www.serverless.com/framework/docs/providers/google/guide/credentials/).

1. Clone the repository.
1. From the root, run:

   ```bash
   yarn install
   ```

1. Check your setup:

   For AWS:

   ```bash
   aws sts get-caller-identity
   serverless --version</pre></td>
   ```

   For GCP:

   ```bash
   gcloud auth activate-service-account --key-file="<path to credentials>"
   gcloud info
   ```

### Creating the `.env` file

1. From the root of the repository, copy the `.env` sample file:

   ```bash
   cp .env.sample .env
   ```

### Choosing the platform

Open the `.env` file and choose between GCP or AWS.

#### Using AWS

AWS is the default.

- Edit the `CTP_POST_BODY` variable under `For AWS`: It contains the commercetools API Extension configuration parameters.
  - `accessKey`: An AWS access key.
  - `accessSecret`: An AWS secret.

**Important:** This variable contains a JSON object. Ensure it is valid JSON.

To configure `accessKey` and `accessSecret` create another IAM user with minimal
privileges. See an example in [`iam/ct-dev-iam.sample.json`](iam/ct-dev-iam.sample.json).
Also see [AWS Lambda](https://docs.commercetools.com/api/projects/api-extensions#aws-lambda-destination).

#### Using GCP

Uncomment all commented variables under `For Google` and edit them:

- `CTP_POST_BODY`: It contains the commercetools API Extension configuration parameters.

  - `url`: URL for the lambda function. Retrieve it from CLI after deployment or from Google Console.
    Example: `https://europe-west3-t1-integration.cloudfunctions.net/t1-ct-dev-api-extension`
  - `headerValue`: A combination of `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD`. You can generate a hash with `echo -n "<user>:<password>" | base64`.

- `PROVIDER`: `google`. Defaults to: `aws`.
- `GCP_PROJECT`: Google project name.
- `GCP_CREDENTIALS`: The absolute path to your Google service account credentials file created in the [Installing the tools section](#installing-the-tools).
- `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD`: for security reasons we need to set
  up basic authentication for the HTTP endpoint (same as in the first point)

**Important:** This variable contains a JSON object. Ensure it is valid JSON.

##### Example

```ini
CTP_POST_BODY="{"destination":{"type":"HTTP","url":"https://europe-west3-t1-integration.cloudfunctions.net/t1-ct-dev-api-extension","authentication":{"type":"AuthorizationHeader","headerValue":"Basic dXNlcjEyMzpwYXNzd29yZDEyMw=="}},"triggers":[{"resourceTypeId":"cart","actions":["Create","Update"]},{"resourceTypeId":"customer","actions":["Create","Update"]},{"resourceTypeId":"order","actions":["Create","Update"]}]}"
PROVIDER="google"
GCP_PROJECT="t1-integration"
GCP_CREDENTIALS="Z:\vault\gcp.json"
BASIC_AUTH_USERNAME="user123"
BASIC_AUTH_PASSWORD="password123"
```

In the above example, the `CTP_POST_BODY` variable contains the following fields and values:

```json
{
  "destination": {
    "type": "HTTP",
    "url": "https://europe-west3-t1-integration.cloudfunctions.net/t1-ct-dev-api-extension",
    "authentication": {
      "type": "AuthorizationHeader",
      "headerValue": "Basic dXNlcjEyMzpwYXNzd29yZDEyMw=="
    }
  },
  "triggers": [
    { "resourceTypeId": "cart", "actions": ["Create", "Update"] },
    { "resourceTypeId": "customer", "actions": ["Create", "Update"] },
    { "resourceTypeId": "order", "actions": ["Create", "Update"] }
  ]
}
```

### Editing the shared variables

1. Edit its content to update the following variables:

   - `CTP_PROJECT_KEY`, `CTP_CLIENT_SECRET`, `CTP_CLIENT_ID`, `CTP_AUTH_URL`,
     `CTP_API_URL`, `CTP_SCOPES`: commercetools API Client Configuration. Create a new API Client with
     scope `manage_project` to get the values.
     See [API Clients](https://docs.commercetools.com/merchant-center/api-clients).

   - `TALON_ONE_API_KEY_V1_<currency code>`: Create an API key to get the values:
     See [Creating an API key](https://help.talon.one/hc/en-us/articles/360010114859-Creating-an-API-Key).

     `<currency code>` is the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of your Application.

     Example: `TALON_ONE_API_KEY_V1_EUR=fae976f994ec07bfc33e`.

   - `TALON_ONE_BASE_PATH_<currency code>`: The base URL of your Talon.One deployment.

     Example: `TALON_ONE_BASE_PATH_EUR=https://mycompany.europe-west1.talon.one`.

   - `LANGUAGE`: The default language code used to map information from commercetools to Talon.One. Defaults to `en`.
    Find the value in **Settings** > **Project settings** > **Languages** in the Merchant Center. Each product must
    have a name in the chosen language.

   - `DISCOUNT_TAX_CATEGORY_ID`: Tax category identifier in commercetools applied to discounts from Talon.One.
     **Note:** If you are using discounts or coupons in Talon.One, you must set this variable.
     See [details](docs/envs/DISCOUNT_TAX_CATEGORY_ID.md).

   - `TALON_ONE_ATTRIBUTES_MAPPINGS`: Determines the mapping between the Talon.One attributes
     and their commercetools equivalents. See [Mapping attributes](#mapping-attributes-between-commercetools-and-talonone).

   - `CART_ATTRIBUTE_MAPPING`, `CART_ITEM_ATTRIBUTE_MAPPING`:
     [Data Mapping Specification](./docs/data-mapping-spec.md)
     [Examples](docs/data-mapping-examples.md)

   - `LOGGER_MODE`: The level of logging. You can set it to `DEBUG` if you want more information about the setup process.

   - `MIGRATION_BATCH_SIZE`: The size of the data bulk (number of customers) fetched from commercetools and sent to
     Talon.One. Defaults to `20`.

   - `ROUNDING_MODE`: The type of rounding to perform for all session amount operations. Possible values:
     - `ROUND_HALF_EVEN`: Round the amount to the nearest even number.
     - `ROUND_HALF_UP`: Round the amount up to the next integer.
     - `ROUND_HALF_DOWN`: Round the amount down to the previous integer.

1. (Optional) Set the following variables:

   - `TALON_ONE_FALLBACK_CURRENCY`: One of the currency codes used above or an empty string.
     The fallback is used when the currency from commercetools cannot be matched in Talon.One.

     > Example:
     >
     > - If `EUR` is received from commercetools and the Talon.One Application uses `PLN` and `USD`, and
         PLN as fallback, we use turn `EUR` into `PLN`.
     > - If the fallback is an empty string, **no data is shared with Talon.One** if the currency doesn't match.

   - `ONLY_VERIFIED_PROFILES`: commercetools will send only profiles with a verified email address.

   - `SKU_TYPE`: Determines how the SKU from Talon.One is converted to `SKU_TYPE` in commercetools. Possible values:
     - `CTP_PRODUCT_ID`: Talon.One SKU to CTP Product ID.
     - `CTP_PRODUCT_ID_WITH_VARIANT_ID`: Talon.One SKU to CTP Product ID and Variant ID. If you choose this, also set `SKU_SEPARATOR`. Defaults to `@`.
     - `CTP_VARIANT_SKU`: Talon.One SKU to CTP SKU.

   - `VERIFY_PRODUCT_IDENTIFIERS`: Determines whether to validate SKUs from Talon.One in commercetools.
     ⚠️ May reduce performance. Possible values: `0` for disabled, `1` for enabled.

   - `VERIFY_TAX_IDENTIFIERS`: Determines whether to validate the TAX ID from the lambda configuration in
     commercetools. ⚠️ May reduce performance.  Possible values: `0` (disabled), `1` (enabled).

   - `CART_ATTRIBUTE_MAPPING`, `CART_ITEM_ATTRIBUTE_MAPPING`:
     [Data Mapping Specification](./docs/data-mapping-spec.md)
     [Examples](docs/data-mapping-examples.md)

   - `PAY_WITH_POINTS_ATTRIBUTE_NAME`: The name of the attribute to use to pay with loyalty points (e.g. `PayWithPoints`).

**Important:** Some of these variables contain JSON data. Ensure it is valid JSON.

### Creating types in commercetools

[Types define custom fields](https://docs.commercetools.com/api/projects/types) in commercetools.
To support Talon.One-specific data, run the following command to create the appropriate types:

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

**Note:** You can see the created extensions using [Impex](https://docs.commercetools.com/tutorials/#impex) using the `Extensions` endpoint. The function is named `t1-ct-dev-api-extension`.

The application is ready [to be deployed](##deploying-an-application).

#### Deleting an extension

**⚠️ This cannot be undone!**

If you run this script again, or if you already have extensions in
commercetools, you are prompted to select the extension to remove.

To delete an extension, find the lambda function by following the structure
below and select it:

`arn:aws:lambda:<AWS REGION>:<AWS ACCOUNTID>:function:t1-ct-<STAGE>-api-extension`

**Note:** If you don't remove the redundant function, all registered functions run
every time you call the commercetools API related to those API Extensions.

### Deploying an application

1. To deploy the extension, run:

   ```bash
   yarn deploy [--stage stage]
   ```

   **Note:** By default, `stage` is set to `dev`.

1. When the application is deployed, call the Lambda function and check the logs:

   ```bash
   yarn api-extension:invoke
   yarn api-extension:logs
   ```

1. If you use GCP, [allow unauthenticated HTTP function invocation](https://cloud.google.com/functions/docs/securing/managing-access-iam#gcloud_4).

### Mapping attributes between commercetools and Talon.One

You can create custom
[attributes](https://help.talon.one/hc/en-us/articles/360010028740-Creating-Attributes) in
Talon.One to represent any data you require to manage your promotions.

This accelerator supports a list of
[commercetools customer core fields](docs/supported-fields.md). Map the ones you
need to their Talon.One equivalents that you created.

To define the mapping, use the `TALON_ONE_ATTRIBUTES_MAPPINGS` env variable as a **one-line** JSON object:

- The keys in the `mappings` object are commercetools fields.
- The correpsonding values are Talon.One attributes.

**Important:** This variable contains a JSON object. Ensure it is valid JSON.

**Indented example:**

For example, if you have a custom attribute in Talon.One called
`shippingAddressStreet`, you can map the address of a customer from
commercetools with the following JSON:

```json
{
   "customerProfile":{
      "onlyVerifiedProfiles": true,
      "mappings":{
         "defaultShippingAddressStreetName":"shippingAddressStreet"
      }
   }
}
```

To see the supported customer core fields, see [Supported fields](docs/supported-fields.md).

To map cart item attributes and cart item attributes, see [Data mapping examples](docs/data-mapping-examples.md).

## Testing your integration

Once you have configured the accelerator, you can test the integration:

1. Enable your connected Application's campaign in Talon.One.
1. Ensure the campaign contains a "triggerable" rule. We recommend a rule that always sends a notification.
1. Trigger a data transfer to Talon.One, for example by creating a cart in your e-commerce platform.
1. Check the API logs in Talon.One to check the data you received by clicking
   **Account** > **Dev Tools** > **Integration API Log**.

You can also use [Impex](https://docs.commercetools.com/tutorials/#impex)'s GraphiQL tool to run the GraphQL queries.

For example, if your Talon.One campaign has a rule that generates a notification, you can run the following query:

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

It should return a `talon_one_cart_notifications` custom field.

For more GraphQL queries, see [Frontend integration](docs/frontend-integration.md).

## Related topics

- [Frontend Integration](docs/frontend-integration.md)
- [Data Mapping Specification](docs/data-mapping-spec.md)
- [accelerator API docs](docs/API.md)
- [Talon.One developer documentation](https://docs.talon.one)
- [commercetools documentation](https://docs.commercetools.com/)

## Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

If you are using commercetools <-> Talon.One accelerator, found a bug or have an
idea how to improve it, please read our [Contributing
Guidelines](https://github.com/talon-one/commercetools-talonone-accelerator/blob/master/.github/CONTRIBUTING.md)
first and follow them.

You can follow the [list of open and active
issues](https://github.com/talon-one/commercetools-talonone-accelerator/issues) or
contact us directly under [opensource@talon.one](mailto:opensource@talon.one).

## Code of Conduct

We have adopted a [Code of
Conduct](https://github.com/talon-one/commercetools-talonone-accelerator/blob/master/CODE_OF_CONDUCT.md)
that we expect project participants to adhere to. Please read the full text so
that you can understand what actions will and will not be tolerated as part of
your activity in this community.
