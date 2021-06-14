## Classes

<dl>
<dt><a href="#ActionFactory">ActionFactory</a></dt>
<dd></dd>
<dt><a href="#CartEventMapper">CartEventMapper</a></dt>
<dd></dd>
<dt><a href="#CustomerEventMapper">CustomerEventMapper</a></dt>
<dd></dd>
<dt><a href="#Money">Money</a></dt>
<dd></dd>
<dt><a href="#OrderEventMapper">OrderEventMapper</a></dt>
<dd></dd>
<dt><a href="#ApiClientService">ApiClientService</a></dt>
<dd></dd>
<dt><a href="#LoggerService">LoggerService</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#setDiscount">setDiscount</a></dt>
<dd></dd>
<dt><a href="#addCustomLineItem">addCustomLineItem</a></dt>
<dd></dd>
<dt><a href="#removeCustomLineItem">removeCustomLineItem</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CtpPrice">CtpPrice</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpLineItem">CtpLineItem</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpCustomLineItem">CtpCustomLineItem</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpCartEventResourceObject">CtpCartEventResourceObject</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpCartEventResource">CtpCartEventResource</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpCartEvent">CtpCartEvent</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpCustomerEventResourceObject">CtpCustomerEventResourceObject</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpCustomerEventResource">CtpCustomerEventResource</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpCustomerEvent">CtpCustomerEvent</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpOrderEventResourceObject">CtpOrderEventResourceObject</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpOrderEventResource">CtpOrderEventResource</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CtpOrderEvent">CtpOrderEvent</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CustomerProfileObject">CustomerProfileObject</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CustomerSessionObject">CustomerSessionObject</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="ActionFactory"></a>

## ActionFactory

**Kind**: global class

- [ActionFactory](#ActionFactory)
  - [new ActionFactory(lang, taxCategoryId, currencyCode)](#new_ActionFactory_new)
  - [.constructFromEffect(effectType, props)](#ActionFactory+constructFromEffect) ⇒ <code>null</code> \| <code>Object</code>
  - [.addCustomLineItemFromEffect(effectType, props)](#ActionFactory+addCustomLineItemFromEffect) ⇒ <code>Object</code>
  - [.addCustomLineItem(name, currencyCode, centAmount)](#ActionFactory+addCustomLineItem) ⇒ <code>Object</code>
  - [.removeCustomLineItem(customLineItemId)](#ActionFactory+removeCustomLineItem) ⇒ <code>Object</code>

<a name="new_ActionFactory_new"></a>

### new ActionFactory(lang, taxCategoryId, currencyCode)

Configure ActionFactory.

| Param         | Type                |
| ------------- | ------------------- |
| lang          | <code>string</code> |
| taxCategoryId | <code>string</code> |
| currencyCode  | <code>string</code> |

<a name="ActionFactory+constructFromEffect"></a>

### actionFactory.constructFromEffect(effectType, props) ⇒ <code>null</code> \| <code>Object</code>

Create commercetools Update Action based on Effect from TalonOne.

**Kind**: instance method of [<code>ActionFactory</code>](#ActionFactory)

| Param      | Type                |
| ---------- | ------------------- |
| effectType | <code>string</code> |
| props      | <code>Object</code> |

<a name="ActionFactory+addCustomLineItemFromEffect"></a>

### actionFactory.addCustomLineItemFromEffect(effectType, props) ⇒ <code>Object</code>

**Kind**: instance method of [<code>ActionFactory</code>](#ActionFactory)

| Param      | Type                |
| ---------- | ------------------- |
| effectType | <code>string</code> |
| props      | <code>Object</code> |

<a name="ActionFactory+addCustomLineItem"></a>

### actionFactory.addCustomLineItem(name, currencyCode, centAmount) ⇒ <code>Object</code>

**Kind**: instance method of [<code>ActionFactory</code>](#ActionFactory)  
**See**: https://docs.commercetools.com/api/projects/carts#add-customlineitem

| Param        | Type                |
| ------------ | ------------------- |
| name         | <code>string</code> |
| currencyCode | <code>string</code> |
| centAmount   | <code>number</code> |

<a name="ActionFactory+removeCustomLineItem"></a>

### actionFactory.removeCustomLineItem(customLineItemId) ⇒ <code>Object</code>

**Kind**: instance method of [<code>ActionFactory</code>](#ActionFactory)  
**See**: https://docs.commercetools.com/api/projects/carts#remove-customlineitem

| Param            | Type                |
| ---------------- | ------------------- |
| customLineItemId | <code>string</code> |

<a name="CartEventMapper"></a>

## CartEventMapper

**Kind**: global class  
<a name="new_CartEventMapper_new"></a>

### new CartEventMapper(lang, cartId, customerId, totalPrice, lineItems)

| Param      | Type                                                   |
| ---------- | ------------------------------------------------------ |
| lang       | <code>string</code>                                    |
| cartId     | <code>string</code>                                    |
| customerId | <code>string</code>                                    |
| totalPrice | [<code>CtpPrice</code>](#CtpPrice)                     |
| lineItems  | [<code>Array.&lt;CtpLineItem&gt;</code>](#CtpLineItem) |

<a name="CustomerEventMapper"></a>

## CustomerEventMapper

**Kind**: global class

- [CustomerEventMapper](#CustomerEventMapper)
  - [new CustomerEventMapper(customerId, customerData, attributeMappings)](#new_CustomerEventMapper_new)
  - [.getProfileIntegrationId()](#CustomerEventMapper+getProfileIntegrationId) ⇒ <code>string</code>
  - [.getDefaultBillingAddress(prefix)](#CustomerEventMapper+getDefaultBillingAddress) ⇒ <code>object</code>
  - [.getDefaultShippingAddress(prefix)](#CustomerEventMapper+getDefaultShippingAddress) ⇒ <code>object</code>
  - [.getAddressById(addressId, prefix)](#CustomerEventMapper+getAddressById) ⇒ <code>object</code>
  - [.mapDate(date)](#CustomerEventMapper+mapDate) ⇒ <code>string</code>
  - [.getCustomAttributes()](#CustomerEventMapper+getCustomAttributes) ⇒ <code>object</code>
  - [.getFlatterAttributes()](#CustomerEventMapper+getFlatterAttributes) ⇒ <code>object</code>
  - [.mapAttributes()](#CustomerEventMapper+mapAttributes) ⇒ <code>Object</code>

<a name="new_CustomerEventMapper_new"></a>

### new CustomerEventMapper(customerId, customerData, attributeMappings)

| Param             | Type                |
| ----------------- | ------------------- |
| customerId        | <code>string</code> |
| customerData      | <code>object</code> |
| attributeMappings | <code>object</code> |

<a name="CustomerEventMapper+getProfileIntegrationId"></a>

### customerEventMapper.getProfileIntegrationId() ⇒ <code>string</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)  
<a name="CustomerEventMapper+getDefaultBillingAddress"></a>

### customerEventMapper.getDefaultBillingAddress(prefix) ⇒ <code>object</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)

| Param  | Type                                     | Default           |
| ------ | ---------------------------------------- | ----------------- |
| prefix | <code>string</code> \| <code>null</code> | <code>null</code> |

<a name="CustomerEventMapper+getDefaultShippingAddress"></a>

### customerEventMapper.getDefaultShippingAddress(prefix) ⇒ <code>object</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)

| Param  | Type                                     | Default           |
| ------ | ---------------------------------------- | ----------------- |
| prefix | <code>string</code> \| <code>null</code> | <code>null</code> |

<a name="CustomerEventMapper+getAddressById"></a>

### customerEventMapper.getAddressById(addressId, prefix) ⇒ <code>object</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)

| Param     | Type                                     | Default           |
| --------- | ---------------------------------------- | ----------------- |
| addressId | <code>string</code>                      |                   |
| prefix    | <code>string</code> \| <code>null</code> | <code>null</code> |

<a name="CustomerEventMapper+mapDate"></a>

### customerEventMapper.mapDate(date) ⇒ <code>string</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)

| Param | Type                |
| ----- | ------------------- |
| date  | <code>string</code> |

<a name="CustomerEventMapper+getCustomAttributes"></a>

### customerEventMapper.getCustomAttributes() ⇒ <code>object</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)  
<a name="CustomerEventMapper+getFlatterAttributes"></a>

### customerEventMapper.getFlatterAttributes() ⇒ <code>object</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)  
<a name="CustomerEventMapper+mapAttributes"></a>

### customerEventMapper.mapAttributes() ⇒ <code>Object</code>

**Kind**: instance method of [<code>CustomerEventMapper</code>](#CustomerEventMapper)  
<a name="Money"></a>

## Money

**Kind**: global class

- [Money](#Money)
  - [new Money(type, currencyCode, amount, fractionDigits)](#new_Money_new)
  - [.getType()](#Money+getType) ⇒ [<code>MoneyType</code>](#MoneyType)
  - [.getFractionDigits()](#Money+getFractionDigits) ⇒ <code>number</code>
  - [.getCurrencyCode()](#Money+getCurrencyCode) ⇒ <code>string</code>
  - [.getDecimalAmount()](#Money+getDecimalAmount) ⇒ <code>number</code>
  - [.getCentAmount()](#Money+getCentAmount) ⇒ <code>number</code>

<a name="new_Money_new"></a>

### new Money(type, currencyCode, amount, fractionDigits)

| Param          | Type                                 | Default        |
| -------------- | ------------------------------------ | -------------- |
| type           | [<code>MoneyType</code>](#MoneyType) |                |
| currencyCode   | <code>string</code>                  |                |
| amount         | <code>number</code>                  |                |
| fractionDigits | <code>number</code>                  | <code>2</code> |

<a name="Money+getType"></a>

### money.getType() ⇒ [<code>MoneyType</code>](#MoneyType)

**Kind**: instance method of [<code>Money</code>](#Money)  
<a name="Money+getFractionDigits"></a>

### money.getFractionDigits() ⇒ <code>number</code>

**Kind**: instance method of [<code>Money</code>](#Money)  
<a name="Money+getCurrencyCode"></a>

### money.getCurrencyCode() ⇒ <code>string</code>

**Kind**: instance method of [<code>Money</code>](#Money)  
<a name="Money+getDecimalAmount"></a>

### money.getDecimalAmount() ⇒ <code>number</code>

**Kind**: instance method of [<code>Money</code>](#Money)  
<a name="Money+getCentAmount"></a>

### money.getCentAmount() ⇒ <code>number</code>

**Kind**: instance method of [<code>Money</code>](#Money)  
<a name="OrderEventMapper"></a>

## OrderEventMapper

**Kind**: global class  
<a name="new_OrderEventMapper_new"></a>

### new OrderEventMapper(cartId, orderState)

| Param      | Type                                   |
| ---------- | -------------------------------------- |
| cartId     | <code>string</code>                    |
| orderState | [<code>OrderState</code>](#OrderState) |

<a name="ApiClientService"></a>

## ApiClientService

**Kind**: global class

- [ApiClientService](#ApiClientService)
  - [new ApiClientService(basePath, apiKey)](#new_ApiClientService_new)
  - [.updateCustomerProfile(id, payload)](#ApiClientService+updateCustomerProfile) ⇒ <code>Promise.&lt;any&gt;</code>
  - [.updateCustomerSession(id, payload)](#ApiClientService+updateCustomerSession) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="new_ApiClientService_new"></a>

### new ApiClientService(basePath, apiKey)

| Param    | Type                |
| -------- | ------------------- |
| basePath | <code>string</code> |
| apiKey   | <code>string</code> |

<a name="ApiClientService+updateCustomerProfile"></a>

### apiClientService.updateCustomerProfile(id, payload) ⇒ <code>Promise.&lt;any&gt;</code>

**Kind**: instance method of [<code>ApiClientService</code>](#ApiClientService)

| Param   | Type                            |
| ------- | ------------------------------- |
| id      | <code>string</code>             |
| payload | <code>NewCustomerProfile</code> |

<a name="ApiClientService+updateCustomerSession"></a>

### apiClientService.updateCustomerSession(id, payload) ⇒ <code>Promise.&lt;any&gt;</code>

**Kind**: instance method of [<code>ApiClientService</code>](#ApiClientService)

| Param   | Type                              |
| ------- | --------------------------------- |
| id      | <code>string</code>               |
| payload | <code>NewCustomerSessionV2</code> |

<a name="LoggerService"></a>

## LoggerService

**Kind**: global class

- [LoggerService](#LoggerService)
  - [new LoggerService(mode)](#new_LoggerService_new)
  - _instance_
    - [.info(...args)](#LoggerService+info)
    - [.debug(...args)](#LoggerService+debug)
    - [.error(...args)](#LoggerService+error)
  - _static_
    - [.checkMode(mode)](#LoggerService.checkMode) ⇒ <code>boolean</code>

<a name="new_LoggerService_new"></a>

### new LoggerService(mode)

| Param | Type                                   |
| ----- | -------------------------------------- |
| mode  | [<code>LoggerMode</code>](#LoggerMode) |

<a name="LoggerService+info"></a>

### loggerService.info(...args)

**Kind**: instance method of [<code>LoggerService</code>](#LoggerService)

| Param   |
| ------- |
| ...args |

<a name="LoggerService+debug"></a>

### loggerService.debug(...args)

**Kind**: instance method of [<code>LoggerService</code>](#LoggerService)

| Param   |
| ------- |
| ...args |

<a name="LoggerService+error"></a>

### loggerService.error(...args)

**Kind**: instance method of [<code>LoggerService</code>](#LoggerService)

| Param   |
| ------- |
| ...args |

<a name="LoggerService.checkMode"></a>

### LoggerService.checkMode(mode) ⇒ <code>boolean</code>

**Kind**: static method of [<code>LoggerService</code>](#LoggerService)

| Param | Type                                   |
| ----- | -------------------------------------- |
| mode  | [<code>LoggerMode</code>](#LoggerMode) |

<a name="setDiscount"></a>

## setDiscount

**Kind**: global variable  
**See:**: https://developers.talon.one/Integration-API/handling-effects#setdiscount  
<a name="addCustomLineItem"></a>

## addCustomLineItem

**Kind**: global variable  
**See**: https://docs.commercetools.com/api/projects/carts#add-customlineitem  
<a name="removeCustomLineItem"></a>

## removeCustomLineItem

**Kind**: global variable  
**See**: https://docs.commercetools.com/api/projects/carts#remove-customlineitem  
<a name="EffectTypeMap"></a>

## EffectTypeMap : <code>enum</code>

**Kind**: global enum  
**Read only**: true  
<a name="LoggerMode"></a>

## LoggerMode : <code>enum</code>

**Kind**: global enum  
**Read only**: true  
<a name="MoneyType"></a>

## MoneyType : <code>enum</code>

**Kind**: global enum  
**Read only**: true  
<a name="OrderState"></a>

## OrderState : <code>enum</code>

**Kind**: global enum  
**Read only**: true  
**See**: https://docs.commercetools.com/api/projects/orders#orderstate  
<a name="UpdateAction"></a>

## UpdateAction : <code>enum</code>

**Kind**: global enum  
**Read only**: true  
**See**: https://docs.commercetools.com/api/projects/carts#update-actions  
<a name="CtpPrice"></a>

## CtpPrice : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name           | Type                |
| -------------- | ------------------- |
| type           | <code>string</code> |
| currencyCode   | <code>string</code> |
| centAmount     | <code>number</code> |
| fractionDigits | <code>number</code> |

<a name="CtpLineItem"></a>

## CtpLineItem : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name        | Type                               |
| ----------- | ---------------------------------- |
| name        | <code>Object</code>                |
| productId   | <code>string</code>                |
| quantity    | <code>number</code>                |
| totalPrice  | [<code>CtpPrice</code>](#CtpPrice) |
| price       | <code>Object</code>                |
| price.value | [<code>CtpPrice</code>](#CtpPrice) |

<a name="CtpCustomLineItem"></a>

## CtpCustomLineItem : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name       | Type                               |
| ---------- | ---------------------------------- |
| name       | <code>Object</code>                |
| productId  | <code>string</code>                |
| quantity   | <code>number</code>                |
| totalPrice | [<code>CtpPrice</code>](#CtpPrice) |
| money      | [<code>CtpPrice</code>](#CtpPrice) |

<a name="CtpCartEventResourceObject"></a>

## CtpCartEventResourceObject : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name       | Type                                                   |
| ---------- | ------------------------------------------------------ |
| id         | <code>string</code>                                    |
| customerId | <code>string</code>                                    |
| totalPrice | [<code>CtpPrice</code>](#CtpPrice)                     |
| lineItems  | [<code>Array.&lt;CtpLineItem&gt;</code>](#CtpLineItem) |

<a name="CtpCartEventResource"></a>

## CtpCartEventResource : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name | Type                                                                   |
| ---- | ---------------------------------------------------------------------- |
| obj  | [<code>CtpCartEventResourceObject</code>](#CtpCartEventResourceObject) |

<a name="CtpCartEvent"></a>

## CtpCartEvent : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name     | Type                                                       |
| -------- | ---------------------------------------------------------- |
| resource | [<code>CtpCartEventResource</code>](#CtpCartEventResource) |

<a name="CtpCustomerEventResourceObject"></a>

## CtpCustomerEventResourceObject : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name                      | Type                |
| ------------------------- | ------------------- |
| id                        | <code>string</code> |
| version                   | <code>string</code> |
| lastMessageSequenceNumber | <code>string</code> |
| createdAt                 | <code>string</code> |
| lastModifiedAt            | <code>string</code> |
| customerNumber            | <code>string</code> |
| email                     | <code>string</code> |
| firstName                 | <code>string</code> |
| lastName                  | <code>string</code> |
| title                     | <code>string</code> |
| salutation                | <code>string</code> |
| dateOfBirth               | <code>string</code> |
| companyName               | <code>string</code> |
| vatId                     | <code>string</code> |
| defaultShippingAddressId  | <code>string</code> |
| defaultBillingAddressId   | <code>string</code> |
| externalId                | <code>string</code> |

<a name="CtpCustomerEventResource"></a>

## CtpCustomerEventResource : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name | Type                                                                           |
| ---- | ------------------------------------------------------------------------------ |
| obj  | [<code>CtpCustomerEventResourceObject</code>](#CtpCustomerEventResourceObject) |

<a name="CtpCustomerEvent"></a>

## CtpCustomerEvent : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name     | Type                                                               |
| -------- | ------------------------------------------------------------------ |
| resource | [<code>CtpCustomerEventResource</code>](#CtpCustomerEventResource) |

<a name="CtpOrderEventResourceObject"></a>

## CtpOrderEventResourceObject : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name       | Type                                   |
| ---------- | -------------------------------------- |
| orderState | [<code>OrderState</code>](#OrderState) |
| cart       | <code>Object</code>                    |
| cart.id    | <code>string</code>                    |

<a name="CtpOrderEventResource"></a>

## CtpOrderEventResource : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name | Type                                                                     |
| ---- | ------------------------------------------------------------------------ |
| obj  | [<code>CtpOrderEventResourceObject</code>](#CtpOrderEventResourceObject) |

<a name="CtpOrderEvent"></a>

## CtpOrderEvent : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name     | Type                                                         |
| -------- | ------------------------------------------------------------ |
| resource | [<code>CtpOrderEventResource</code>](#CtpOrderEventResource) |

<a name="CustomerProfileObject"></a>

## CustomerProfileObject : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name    | Type                            |
| ------- | ------------------------------- |
| id      | <code>string</code>             |
| payload | <code>NewCustomerProfile</code> |

<a name="CustomerSessionObject"></a>

## CustomerSessionObject : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name    | Type                              |
| ------- | --------------------------------- |
| id      | <code>string</code>               |
| payload | <code>NewCustomerSessionV2</code> |
