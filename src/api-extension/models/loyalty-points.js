'use strict';

class LoyaltyPoints {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} title
   * @param {number} balance
   * @param {string} currency
   */
  constructor(id, name, title, balance, currency) {
    this._id = id;
    this._name = name;
    this._title = title;
    this._balance = balance;
    this._currency = currency;
  }

  toObject() {
    return {
      id: this._id,
      name: this._name,
      title: this._title,
      balance: this._balance,
      currency: this._currency,
    };
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }

  getTitle() {
    return this._title;
  }

  getBalance() {
    return this._balance;
  }

  getCurrency() {
    return this._currency;
  }

  toString() {
    return `${this._id}-${this._name}-${this._title}-${this._balance}-${this._currency}`;
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  /**
   * @param {LoyaltyPoints} loyaltyPoints
   * @return {boolean}
   */
  compare(loyaltyPoints) {
    if (!(loyaltyPoints instanceof LoyaltyPoints)) {
      throw new Error('Invalid loyaltyPoints type.');
    }

    return this.toString() === loyaltyPoints.toString();
  }
}

module.exports = {
  LoyaltyPoints,
};
