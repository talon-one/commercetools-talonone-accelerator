'use strict';

class CustomerEventMapper {
  /**
   * @param {string} customerId
   * @param {object} customerData
   * @param {object} attributeMappings
   */
  constructor(customerId, customerData, attributeMappings) {
    this.customerId = customerId;
    this.customerData = customerData;
    this.attributeMappings = attributeMappings;
  }

  /**
   * @return {string}
   */
  getProfileIntegrationId() {
    return this.customerId;
  }

  /**
   * @param {string|null} prefix
   * @return {object}
   */
  getDefaultBillingAddress(prefix = null) {
    const defaultBillingAddressId = this.customerData.defaultBillingAddressId;

    return this.getAddressById(defaultBillingAddressId, prefix);
  }

  /**
   * @param {string|null} prefix
   * @return {object}
   */
  getDefaultShippingAddress(prefix = null) {
    const defaultShippingAddressId = this.customerData.defaultShippingAddressId;

    return this.getAddressById(defaultShippingAddressId, prefix);
  }

  /**
   * @param {string} addressId
   * @param {string|null} prefix
   * @return {object}
   */
  getAddressById(addressId, prefix = null) {
    const addresses = this.customerData.addresses;

    const matchingAddress = (customerAddressId, customerAddresses) =>
      customerAddresses.find((el) => el.id === customerAddressId);

    const address = matchingAddress(addressId, addresses);

    if (typeof address === 'undefined') {
      return {};
    }

    if (prefix === null) {
      return address;
    }

    const prefixedAddress = {};

    Object.entries(address).forEach(([key, value]) => {
      prefixedAddress[prefix + key[0].toUpperCase() + key.slice(1)] = value;
    });

    return prefixedAddress;
  }

  getFullName() {
    const firstName = this.customerData.firstName;
    const lastName = this.customerData.lastName;

    if (typeof firstName === 'undefined' || typeof lastName === 'undefined') {
      return null;
    }

    return firstName.concat(' ', lastName);
  }

  /**
   * @param {string} date
   * @return {string}
   */
  mapDate(date) {
    if (typeof date === 'undefined') {
      return date;
    }

    const dateObject = new Date(date);
    return dateObject.toISOString();
  }

  /**
   * @returns {object}
   */
  getCustomAttributes() {
    const custom = this.customerData.custom;

    if (typeof custom === 'undefined') {
      return {};
    }

    return custom.fields;
  }

  /**
   * @returns {object}
   */
  getFlatterAttributes() {
    const coreAttributes = {
      id: this.customerData.id,
      email: this.customerData.email,
      firstName: this.customerData.firstName,
      lastName: this.customerData.lastName,
      name: this.getFullName(),
      createdAt: this.mapDate(this.customerData.createdAt),
      customerNumber: this.customerData.customerNumber,
      middleName: this.customerData.middleName,
      title: this.customerData.title,
      salutation: this.customerData.salutation,
      dateOfBirth: this.mapDate(this.customerData.dateOfBirth),
      companyName: this.customerData.companyName,
      vatId: this.customerData.vatId,
      defaultShippingAddressId: this.customerData.defaultShippingAddressId,
      defaultBillingAddressId: this.customerData.defaultBillingAddressId,
      externalId: this.customerData.externalId,
      isEmailVerified: this.customerData.isEmailVerified,
    };

    const billingAttributes = this.getDefaultBillingAddress('defaultBillingAddress');
    const shippingAttributes = this.getDefaultShippingAddress('defaultShippingAddress');
    const customAttributes = this.getCustomAttributes();

    return JSON.parse(
      JSON.stringify({
        ...coreAttributes,
        ...billingAttributes,
        ...shippingAttributes,
        ...customAttributes,
      })
    );
  }

  /**
   * @return {{object}}
   */
  mapAttributes() {
    const attributes = this.getFlatterAttributes();
    const keysMap = this.attributeMappings.mappings;

    const mapKeys = (keysMappings, attrs) => {
      return Object.keys(keysMappings).reduce(
        (acc, key) => ({
          ...acc,
          ...{ [keysMappings[key] || key]: attrs[key] },
        }),
        {}
      );
    };

    return mapKeys(keysMap, attributes);
  }
}

module.exports = { CustomerEventMapper };
