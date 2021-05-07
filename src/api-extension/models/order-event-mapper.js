'use strict';
const { OrderState } = require('./order-state');
const { NewCustomerSessionV2 } = require('talon_one');

class OrderEventMapper {
  /**
   * @param {string} cartId
   * @param {OrderState} orderState
   */
  constructor(cartId, orderState) {
    this.cartId = cartId;
    this.orderState = orderState;
  }

  getSessionIntegrationId() {
    return this.cartId;
  }

  getState() {
    switch (this.orderState) {
      case OrderState.Open:
      case OrderState.Complete:
      case OrderState.Confirmed:
        return NewCustomerSessionV2.StateEnum.closed;

      case OrderState.Cancelled:
        return NewCustomerSessionV2.StateEnum.cancelled;

      default:
        return NewCustomerSessionV2.StateEnum.open;
    }
  }
}

module.exports = { OrderEventMapper };
