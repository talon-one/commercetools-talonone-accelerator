/**
 * @typedef {Object} CtpPrice
 * @property {string} type
 * @property {string} currencyCode
 * @property {number} centAmount
 * @property {number} fractionDigits
 */

/**
 * @typedef {Object} CtpLineItemVariantAttribute
 * @property {string} name
 * @property {any} value
 */

/**
 * @typedef {Object} CtpLineItem
 * @property {string} id
 * @property {Object} name
 * @property {string} productId
 * @property {number} quantity
 * @property {CtpPrice} totalPrice
 * @property {Object} price
 * @property {CtpPrice} price.value
 * @property {Object} variant
 * @property {number} variant.id
 * @property {string} variant.sku
 * @property {CtpLineItemVariantAttribute[]} variant.attributes
 * @property {Object} custom
 * @property {Object} custom.fields
 */

/**
 * @typedef {Object} CtpCustomLineItem
 * @property {string} id
 * @property {Object} name
 * @property {string} productId
 * @property {number} quantity
 * @property {CtpPrice} totalPrice
 * @property {CtpPrice} money
 * @property {Object} custom
 * @property {Object} custom.fields
 */

/**
 * @typedef {Object} CtpCustom
 * @property {Object} type
 * @property {string} type.id
 * @property {string} type.typeId
 * @property {Object} fields
 * @property {string} fields.talon_one_cart_notifications
 * @property {string} fields.talon_one_cart_referral_code
 * @property {boolean} fields.talon_one_cart_pay_with_points
 */

/**
 * @typedef {Object} CtpCartEventResourceObject
 * @property {string} id
 * @property {string} customerId
 * @property {CtpPrice} totalPrice
 * @property {CtpLineItem[]} lineItems
 * @property {CtpCustomLineItem[]} customLineItems
 * @property {CtpCustom} custom
 */

/**
 * @typedef {Object} CtpCartEventResource
 * @property {CtpCartEventResourceObject} obj
 */

/**
 * @typedef {Object} CtpCartEvent
 * @property {CtpCartEventResource} resource
 */

/**
 * @typedef {Object} CtpCustomerCustomFields
 * @property {Object} fields
 * @property {string[]} fields.talon_one_customer_referral_codes
 * @property {string} fields.talon_one_customer_loyalty_points
 */

/**
 * @typedef {Object} CtpCustomerEventResourceObject
 * @property {string} id
 * @property {string} version
 * @property {string} lastMessageSequenceNumber
 * @property {string} createdAt
 * @property {string} lastModifiedAt
 * @property {string} customerNumber
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} title
 * @property {string} salutation
 * @property {string} dateOfBirth
 * @property {string} companyName
 * @property {string} vatId
 * @property {string} defaultShippingAddressId
 * @property {string} defaultBillingAddressId
 * @property {string} externalId
 * @property {CtpCustomerCustomFields} custom
 */

/**
 * @typedef {Object} CtpCustomerEventResource
 * @property {CtpCustomerEventResourceObject} obj
 */

/**
 * @typedef {Object} CtpCustomerEvent
 * @property {CtpCustomerEventResource} resource
 */

/**
 * @typedef {Object} CtpOrderEventResourceObject
 * @property {OrderState} orderState
 * @property {Object} cart
 * @property {string} cart.id
 */

/**
 * @typedef {Object} CtpOrderEventResource
 * @property {CtpOrderEventResourceObject} obj
 */

/**
 * @typedef {Object} CtpOrderEvent
 * @property {CtpOrderEventResource} resource
 */
