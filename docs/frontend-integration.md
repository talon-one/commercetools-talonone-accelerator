# Frontend Integration

## Features

- [Coupons](#coupons)
- [Referrals](#referrals)
- [Free items](#free-items)
- [Discounts](#discounts)
- [Discount per item](#discount-per-item)
- [Notifications](#notifications)
- [Loyalty](#loyalty)

### Coupons

#### Apply a coupon

Query:

```graphql
mutation updateCart($version: Long!, $shoppingCartId: String, $couponCode: String!) {
  updateCart(
    version: $version
    id: $shoppingCartId
    actions: {
      setCustomType: {
        type: { key: "talon_one_cart_metadata" }
        fields: [
          { name: "talon_one_cart_coupon_code_action", value: "\"apply\"" }
          { name: "talon_one_cart_coupon_code_action_value", value: $couponCode }
        ]
      }
    }
  ) {
    version
    customLineItems {
      id
      name(locale: "en")
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
  }
}
```

Sample variables:

```json
{
  "version": 92,
  "shoppingCartId": "02919cff-5c28-42fa-a98a-74f3ef30fade",
  "couponCode": "\"CC-12-25-56-81\""
}
```

Sample result:

```json
{
  "data": {
    "updateCart": {
      "version": 98,
      "customLineItems": [
        {
          "id": "fb6365d6-0d8d-44e3-acae-8e71355ce860",
          "name": "CC-12-25-56-81",
          "custom": {
            "customFieldsRaw": [
              {
                "name": "talon_one_line_item_effect",
                "value": "acceptCoupon"
              },
              {
                "name": "talon_one_coupon_code",
                "value": "CC-12-25-56-81"
              }
            ]
          }
        }
      ]
    }
  }
}
```

#### Receive coupons

Query:

```graphql
query getCoupons($shoppingCartId: String!) {
  cart(id: $shoppingCartId) {
    customLineItems {
      id
      name(locale: "en")
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
  }
}
```

Sample variables:

```json
{
  "shoppingCartId": "02919cff-5c28-42fa-a98a-74f3ef30fade"
}
```

Sample result:

```json
{
  "data": {
    "cart": {
      "customLineItems": [
        {
          "id": "f8a8db95-2631-4aee-9560-5bb0a2cdedf0",
          "name": "CC-12-25-56-81",
          "custom": {
            "customFieldsRaw": [
              {
                "name": "talon_one_line_item_effect",
                "value": "acceptCoupon"
              },
              {
                "name": "talon_one_coupon_code",
                "value": "CC-12-25-56-81"
              }
            ]
          }
        }
      ]
    }
  }
}
```

Custom line items with `talon_one_line_item_effect` equal to
`acceptCoupon` are coupons. The coupon value is in the field with name
`talon_one_coupon_code`.

#### Remove a coupon

Query:

```graphql
mutation updateCart($version: Long!, $shoppingCartId: String, $couponCode: String!) {
  updateCart(
    version: $version
    id: $shoppingCartId
    actions: {
      setCustomType: {
        type: { key: "talon_one_cart_metadata" }
        fields: [
          { name: "talon_one_cart_coupon_code_action", value: "\"remove\"" }
          { name: "talon_one_cart_coupon_code_action_value", value: $couponCode }
        ]
      }
    }
  ) {
    version
    customLineItems {
      id
      name(locale: "en")
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
  }
}
```

Sample variables:

```json
{
  "version": 98,
  "shoppingCartId": "02919cff-5c28-42fa-a98a-74f3ef30fade",
  "couponCode": "\"CC-12-25-56-81\""
}
```

Sample result:

```json
{
  "data": {
    "updateCart": {
      "version": 109,
      "customLineItems": []
    }
  }
}
```

### Referrals

#### Apply a referral code

Query:

```graphql
mutation updateCart($version: Long!, $shoppingCartId: String, $referralCode: String!) {
  updateCart(
    version: $version
    id: $shoppingCartId
    actions: {
      setCustomType: {
        type: { key: "talon_one_cart_metadata" }
        fields: [{ name: "talon_one_cart_referral_code", value: $referralCode }]
      }
    }
  ) {
    version
    custom {
      customFieldsRaw {
        name
        value
      }
    }
  }
}
```

Sample variables:

```json
{
  "version": 70,
  "shoppingCartId": "faef1da2-75b7-40bc-a906-1a9b57012f97",
  "referralCode": "\"FX5B-NVAH\""
}
```

Sample result:

```json
{
  "data": {
    "updateCart": {
      "version": 10,
      "custom": {
        "customFieldsRaw": [
          {
            "name": "talon_one_cart_referral_code",
            "value": "FX5B-NVAH"
          }
        ]
      }
    }
  }
}
```

#### Receive referrals

Query:

```graphql
query getReferrals($customerId: String!) {
  customer(id: $customerId) {
    custom {
      customFieldsRaw {
        name
        value
      }
    }
  }
}
```

Sample variables:

```json
{
  "customerId": "449ddd9d-1003-4cdc-a0e6-7118aa0c38e5"
}
```

Sample result:

```json
{
  "data": {
    "customer": {
      "custom": {
        "customFieldsRaw": [
          {
            "name": "talon_one_customer_referral_codes",
            "value": ["EUR__Y85H-QHYN", "EUR__J85Q-EPBB", "EUR__RABK-89QE"]
          }
        ]
      }
    }
  }
}
```

#### Remove a referral

Query:

```graphql
mutation updateCart($version: Long!, $shoppingCartId: String, $referralCode: String!) {
  updateCart(
    version: $version
    id: $shoppingCartId
    actions: {
      setCustomType: {
        type: { key: "talon_one_cart_metadata" }
        fields: [{ name: "talon_one_cart_referral_code", value: $referralCode }]
      }
    }
  ) {
    version
    custom {
      customFieldsRaw {
        name
        value
      }
    }
  }
}
```

Sample variables:

```json
{
  "version": 70,
  "shoppingCartId": "faef1da2-75b7-40bc-a906-1a9b57012f97",
  "referralCode": "\"\""
}
```

Sample result:

```json
{
  "data": {
    "updateCart": {
      "version": 80,
      "custom": null
    }
  }
}
```

### Free items

#### Receive free items

Query:

```graphql
query cart($shoppingCartId: String!) {
  cart(id: $shoppingCartId) {
    lineItems {
      id
      name(locale: "en")
      totalPrice {
        centAmount
      }
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
  }
}
```

Sample variables:

```json
{
  "shoppingCartId": "faef1da2-75b7-40bc-a906-1a9b57012f97"
}
```

Sample result:

```json
{
  "data": {
    "cart": {
      "lineItems": [
        {
          "id": "d22267e5-e94e-4a30-9a3d-05669890975c",
          "name": "Sweater Polo Ralph Lauren pink",
          "totalPrice": {
            "centAmount": 48000
          },
          "custom": null
        },
        {
          "id": "b49051ae-d4da-472c-b5e1-602ba7741d17",
          "name": "Shirt ”David” MU light blue",
          "totalPrice": {
            "centAmount": 0
          },
          "custom": {
            "customFieldsRaw": [
              {
                "name": "talon_one_line_item_effect",
                "value": "addFreeItem"
              }
            ]
          }
        }
      ]
    }
  }
}
```

Line items with `talon_one_line_item_effect` equal to `addFreeItem` are
free items.

### Discounts

#### Receive discounts

Query:

```graphql
query cart($shoppingCartId: String!) {
  cart(id: $shoppingCartId) {
    lineItems {
      id
      name(locale: "en")
      totalPrice {
        centAmount
      }
    }
    customLineItems {
      id
      name(locale: "en")
      totalPrice {
        centAmount
      }
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
  }
}
```

Sample variables:

```json
{
  "shoppingCartId": "faef1da2-75b7-40bc-a906-1a9b57012f97"
}
```

Sample result:

```json
{
  "data": {
    "cart": {
      "lineItems": [
        {
          "id": "d22267e5-e94e-4a30-9a3d-05669890975c",
          "name": "Sweater Polo Ralph Lauren pink",
          "totalPrice": {
            "centAmount": 48000
          }
        }
      ],
      "customLineItems": [
        {
          "id": "84597da3-9ab4-44cb-b561-70992bc48285",
          "name": "10% off",
          "totalPrice": {
            "centAmount": -4800
          },
          "custom": {
            "customFieldsRaw": [
              {
                "name": "talon_one_line_item_effect",
                "value": "setDiscount"
              }
            ]
          }
        }
      ]
    }
  }
}
```

Custom line items with `talon_one_line_item_effect` equal to
`setDiscount` are discounts.

### Discount per item

#### Receive discount per item

Query:

```graphql
query cart($shoppingCartId: String!) {
  cart(id: $shoppingCartId) {
    lineItems {
      id
      name(locale: "en")
      priceMode
      quantity
      price {
        value {
          centAmount
        }
      }
      totalPrice {
        centAmount
      }
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
  }
}
```

Sample variables:

```json
{
  "shoppingCartId": "faef1da2-75b7-40bc-a906-1a9b57012f97"
}
```

Sample result:

```json
{
  "data": {
    "cart": {
      "lineItems": [
        {
          "id": "d22267e5-e94e-4a30-9a3d-05669890975c",
          "name": "Sweater Polo Ralph Lauren pink",
          "priceMode": "ExternalTotal",
          "quantity": 1,
          "price": {
            "value": {
              "centAmount": 16000
            }
          },
          "totalPrice": {
            "centAmount": 14400
          },
          "custom": null
        }
      ]
    }
  }
}
```

Line items with `priceMode` equal to `ExternalTotal` are discount per
item. The difference between `price.value.centAmount` and
`totalPrice.centAmount` is the amount of discount.

### Notifications

#### Receive notifications

Query:

```graphql
query cart($shoppingCartId: String!) {
  cart(id: $shoppingCartId) {
    custom {
      customFieldsRaw {
        name
        value
      }
    }
  }
}
```

Sample variables:

```json
{
  "shoppingCartId": "faef1da2-75b7-40bc-a906-1a9b57012f97"
}
```

Sample result:

```json
{
  "data": {
    "cart": {
      "custom": {
        "customFieldsRaw": [
          {
            "name": "talon_one_cart_notifications",
            "value": "[{\"type\":\"Info\",\"title\":\"Retargeting\",\"body\":\"Enter text here. You can add variables like  to make the message more dynamic.\",\"effect\":\"showNotification\",\"code\":\"\"},{\"type\":\"Offer\",\"title\":\"Retargeting\",\"body\":\"Enter text here. You can add variables like  to make the message more dynamic.\",\"effect\":\"showNotification\",\"code\":\"\"},{\"type\":\"Error\",\"title\":\"Retargeting\",\"body\":\"Enter text here. You can add variables like  to make the message more dynamic.\",\"effect\":\"showNotification\",\"code\":\"\"},{\"type\":\"Misc\",\"title\":\"Retargeting\",\"body\":\"Enter text here. You can add variables like  to make the message more dynamic.\",\"effect\":\"showNotification\",\"code\":\"\"}]"
          }
        ]
      }
    }
  }
}
```

The `talon_one_cart_notifications` field contains a serialized list of
notifications. Each notification has the following format:

```json
{
  "type": "",
  "title": "",
  "body": "",
  "effect": "",
  "code": ""
}
```

where:

- `type` - one of the following values: `Info`, `Offer`, `Error` or
  `Misc`
- `title`, `body` - any string of characters
- `effect` -
  [effect name](https://developers.talon.one/Integration-API/handling-effects)
  from Talon.One (e.g. `showNotification`)
- `code` -
  [meta-response code](https://developers.talon.one/Integration-API/Understanding-the-meta-response)
  (e.g. `CouponNotFound`)

All queries can be tested in
[ImpEx](https://impex.europe-west1.gcp.commercetools.com/).

Also, you can use `My` functionality, for example,
[My Carts](https://docs.commercetools.com/api/projects/me-carts#get-a-cart)
to get notifications or another resource:

```graphql
{
  me {
    activeCart {
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
  }
}
```

### Loyalty

#### Pay with points

Query:

```graphql
mutation updateCart($version: Long!, $shoppingCartId: String) {
  updateCart(
    version: $version
    id: $shoppingCartId
    actions: {
      setCustomType: {
        type: { key: "talon_one_cart_metadata" }
        fields: [{ name: "talon_one_cart_pay_with_points", value: "true" }]
      }
    }
  ) {
    custom {
      customFieldsRaw {
        name
        value
      }
    }
  }
}
```

Sample variables:

```json
{
  "version": 70,
  "shoppingCartId": "faef1da2-75b7-40bc-a906-1a9b57012f97"
}
```

Sample result:

```json
{
  "data": {
    "updateCart": {
      "custom": {
        "customFieldsRaw": [
          {
            "name": "talon_one_cart_pay_with_points",
            "value": true
          }
        ]
      }
    }
  }
}
```

#### Receive loyalty points

Query:

```graphql
query getLoyaltyPoints($customerId: String!) {
  customer(id: $customerId) {
    custom {
      customFieldsRaw {
        name
        value
      }
    }
  }
}
```

Sample variables:

```json
{
  "customerId": "449ddd9d-1003-4cdc-a0e6-7118aa0c38e5"
}
```

Sample result:

```json
{
  "data": {
    "customer": {
      "custom": {
        "customFieldsRaw": [
          {
            "name": "talon_one_customer_loyalty_points",
            "value": "[{\"id\":1,\"name\":\"SampleWallet\",\"title\":\"Sample Wallet\",\"balance\":0,\"currency\":\"EUR\"}]"
          }
        ]
      }
    }
  }
}
```

The `talon_one_customer_loyalty_points` field contains a serialized list
of loyalty points. Each loyalty point has the following format:

```json
{
  "id": "",
  "name": "",
  "title": "",
  "balance": "",
  "currency": ""
}
```
