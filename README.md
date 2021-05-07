# TalonOne Commercetools Integration

## Getting started

First, install and configure tools from the list below (if you don't
have them yet):

* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
* [Serverless Framework](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
  * To work with `Serverless Framework` you can create IAM user with
    minimal privileges (e.g. `iam/serverless-dev-iam.sample.json`).

Then you can check if everything is ok:

```bash
aws sts get-caller-identity
serverless --version
```

In the next step, we will configure our environment.

### Creating .env file

```bash
cp .env.sample .env
vi .env
```

where variables are:

* `CTP_PROJECT_KEY`, `CTP_CLIENT_SECRET`, `CTP_CLIENT_ID`,
  `CTP_AUTH_URL`, `CTP_API_URL`, `CTP_SCOPES` - Commercetools API Client
  Configuration (you can get these by creanting new API Client with
  scope `manage_project` -
  [more details](https://docs.commercetools.com/merchant-center/api-clients)).
* `CTP_DEPLOY_TYPE`, `CTP_POST_BODY` - Commercetools API Extension
  configuration parameters
  ([more details](https://docs.commercetools.com/api/projects/api-extensions#aws-lambda-destination)).
  To configure `accessKey` and `accessSecret` you can create another IAM
  user with minimal privileges (e.g. `iam/ct-dev-iam.sample.json`).
* `TALON_ONE_API_KEY_V1_<currency code>`, `TALON_ONE_BASE_PATH_<currency
  code>` - Talon.One API Client Configuration (you can get these by
  creanting new API Client -
  [more details](https://help.talon.one/hc/en-us/articles/360010114859-Creating-an-API-Key)).
  * `<currency code>` - The currency code compliant to
    [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) (e.g. `EUR`,
    `USD`). Each currency code should have a unique application in
    Talon.One.
* `TALON_ONE_FALLBACK_CURRENCY` - one of the currency codes used above
  or empty string if we don't want to use fallback. Fallback will be
  used when it will not be possible to match already set codes with code
  from Commercetools. For example:
  * Currency code received from CTP: `EUR`
  * Currency codes in configuration: `PLN`, `USD`
      * Fallback currency code: `PLN`
        * Currency code sent to Talon.One: `PLN`
      * Fallback currency code: `''`
        * No data was sent to Talon.One.
* `TALON_ONE_ATTRIBUTES_MAPPINGS` - Mappings configuration.
* `LANGUAGE` - The default language code, that will be used to map
  information from Commercetools to Talon.One (by default `en`).
* `DISCOUNT_TAX_CATEGORY_ID` - Tax category identifier in Commercetools
  applied to discounts from Talon.One.
* `ONLY_VERIFIED_PROFILES` - Commercetools will send only profiles with
  verified email address.
* `SKU_TYPE` - SKU from Talon.One will be converted to `SKU_TYPE` in
  Commercetools. Possible values:
  * `CTP_PRODUCT_ID` (T1 SKU -> CTP Product ID)
  * `CTP_PRODUCT_ID_WITH_VARIANT_ID` (T1 SKU -> CTP Product ID and
    Variant ID)
    * `SKU_SEPARATOR` - You must pass a Product ID with Variant ID
      separated by `SKU_SEPARATOR` (e.g. T1 SKU = "123@1"). Default: `@`.
  * `CTP_VARIANT_SKU` (T1 SKU -> CTP SKU)
* `VERIFY_PRODUCT_IDENTIFIERS` - option defining whether to validate SKU
  from Talon.One in Commercetools (may reduce performance). Possible
  values: `0` (disabled), `1` (enabled).
* `CART_ATTRIBUTE_MAPPING`, `CART_ITEM_ATTRIBUTE_MAPPING` -
  [Data Mapping Specification](./docs/data-mapping-spec.md)

Next, we will create custom types.

### Creating Types in Commercetools

```bash
yarn register-api-types
```

Now, we can move on to the next step, which is creating an API Extension
in Commercetools.

### Creating an API Extension in Commercetools

To create an extension, run the following command:

```
yarn register-api-extension
```

If you run this again, or if you already have extensions in
Commercetools, you will be prompted to select the one you would like to
remove.

**Be careful this cannot be undone!**

In the first case, find our lambda function by following the structure
below and select it:

`arn:aws:lambda:<AWS REGION>:<AWS ACCOUNT
ID>:function:t1-ct-<STAGE>-api-extension`

(If you don't remove the redundant function, all registered functions
will be run every time you call Commercetools API related to those API
Extensions.)

In the second case or if you are not sure, select "None".

At the end you will see the details of the newly created extension in
Commercetools.

The final step is deploying an Application.

### Deploying an Application

To deploy the lambda function, run the following command:

```bash
yarn deploy [--stage stage]
```

By default, `stage` is set to `dev`.

Finally, you can call the function and check the logs:

```bash
yarn api-extension:invoke
yarn api-extension:logs
```

### Mapping Attributes between commercetools and Talon.One

Talon.One requires specific predefined pack of attributes which can be
sent from commercetools. To specify which attributes should be sent, a
`TALON_ONE_ATTRIBUTES_MAPPINGS` env variable must be defined as a JSON f.e:
```sh
{
   "customerProfile":{
      "onlyVerifiedProfiles": true,
      "mappings":{
         "commerceToolsAttributeOneName":"talonOneAttributeOneName",
         "commerceToolsAttributeTwoName":"talonOneAttributeTwoName",
      }
   }
}
```

Variable accept JSON as a single line string

```sh
{ "customerProfile":{ "onlyVerifiedProfiles": true, "mappings":{ "commerceToolsAttributeOneName":"talonOneAttributeOneName", "commerceToolsAttributeTwoName":"talonOneAttributeTwoName", } } }
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

## More

- [Frontend Integration](docs/frontend-integration.md)
- [Data Mapping Specification](docs/data-mapping-spec.md)
