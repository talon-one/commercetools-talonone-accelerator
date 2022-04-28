'use strict';
const { MoneyType } = require('./money-type');
const Decimal = require('decimal.js');
const { Env } = require('./env');

class Money {
  /**
   * @param {MoneyType} type
   * @param {string} currencyCode
   * @param {number} amount
   * @param {number} fractionDigits
   * @param {6|5|4} rounding
   */
  constructor(type, currencyCode, amount, fractionDigits = 2, rounding = Env.getRoundingMode()) {
    this.type = type;
    this.currencyCode = currencyCode;
    this.amount = amount;
    this.fractionDigits = fractionDigits;
    this.rounding = rounding;

    this.Decimal = Decimal.clone({ rounding });

    if (
      ![Decimal.ROUND_HALF_EVEN, Decimal.ROUND_HALF_UP, Decimal.ROUND_HALF_DOWN].includes(rounding)
    ) {
      throw new Error(`Invalid rounding mode: ${rounding}`);
    }

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
   * @returns {6|5|4}
   */
  getRounding() {
    return this.rounding;
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
    return new this.Decimal(this.getAmount())
      .div(new this.Decimal(10).pow(this.fractionDigits))
      .toNumber();
  }

  /**
   * @returns {number}
   */
  getCentAmount() {
    if (this.type === MoneyType.CENT_PRECISION) {
      return this.amount;
    }
    return new this.Decimal(this.getAmount())
      .mul(new this.Decimal(10).pow(this.fractionDigits))
      .round()
      .toNumber();
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
   * @param {MoneyType} type
   * @returns {Money}
   */
  subtract(otherMoney, type = MoneyType.CENT_PRECISION) {
    if (!(otherMoney instanceof Money)) {
      throw new Error('Invalid otherMoney type.');
    }

    if (this.getCurrencyCode() !== otherMoney.getCurrencyCode()) {
      throw new Error('Different currency codes occurred.');
    }

    if (this.getFractionDigits() !== otherMoney.getFractionDigits()) {
      throw new Error('Different fraction digits occurred.');
    }

    if (type === MoneyType.CENT_PRECISION) {
      return new Money(
        MoneyType.CENT_PRECISION,
        this.getCurrencyCode(),
        this.getCentAmount() - otherMoney.getCentAmount(),
        this.getFractionDigits(),
        this.getRounding()
      );
    }

    return new Money(
      MoneyType.DECIMAL_PRECISION,
      this.getCurrencyCode(),
      this.getDecimalAmount() - otherMoney.getDecimalAmount(),
      this.getFractionDigits(),
      this.getRounding()
    );
  }
}

module.exports = { Money };
