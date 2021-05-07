'use strict';
const { MoneyType } = require('./money-type');

class Money {
  /**
   * @param {MoneyType} type
   * @param {string} currencyCode
   * @param {number} amount
   * @param {number} fractionDigits
   */
  constructor(type, currencyCode, amount, fractionDigits = 2) {
    this.type = type;
    this.currencyCode = currencyCode;
    this.amount = amount;
    this.fractionDigits = fractionDigits;

    if (![MoneyType.CENT_PRECISION, MoneyType.DECIMAL_PRECISION].includes(this.type)) {
      throw new Error('Unsupported type.');
    }
  }

  /**
   * @returns {MoneyType}
   */
  getType() {
    return this.type;
  }

  /**
   * @returns {number}
   */
  getFractionDigits() {
    return this.fractionDigits;
  }

  /**
   * @returns {string}
   */
  getCurrencyCode() {
    return this.currencyCode;
  }

  /**
   * @returns {number}
   */
  getDecimalAmount() {
    if (this.type === MoneyType.DECIMAL_PRECISION) {
      return this.amount;
    }
    return this.amount / Math.pow(10, this.fractionDigits);
  }

  /**
   * @returns {number}
   */
  getCentAmount() {
    if (this.type === MoneyType.CENT_PRECISION) {
      return this.amount;
    }
    return Math.trunc(this.amount * Math.pow(10, this.fractionDigits));
  }

  /**
   * @returns {number}
   */
  getAmount() {
    return this.amount;
  }

  /**
   * Returns a new Money object.
   *
   * @param {number} multiplier
   * @returns {Money}
   */
  multiply(multiplier) {
    return new Money(
      this.getType(),
      this.getCurrencyCode(),
      this.getAmount() * multiplier,
      this.getFractionDigits()
    );
  }

  /**
   * Returns a new Money object.
   *
   * @param {Money} otherMoney
   * @returns {Money}
   */
  subtract(otherMoney) {
    if (!(otherMoney instanceof Money)) {
      throw new Error('Invalid otherMoney type.');
    }

    if (this.getCurrencyCode() !== otherMoney.getCurrencyCode()) {
      throw new Error('Different currency codes occurred.');
    }

    if (this.getFractionDigits() !== otherMoney.getFractionDigits()) {
      throw new Error('Different fraction digits occurred.');
    }

    return new Money(
      MoneyType.CENT_PRECISION,
      this.getCurrencyCode(),
      this.getCentAmount() - otherMoney.getCentAmount(),
      this.getFractionDigits()
    );
  }
}

module.exports = { Money };
