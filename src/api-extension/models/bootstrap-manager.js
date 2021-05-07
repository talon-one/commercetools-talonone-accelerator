'use strict';
const { CustomerEventValidator } = require('./customer-event-validator');
const { OrderEventValidator } = require('./order-event-validator');
const { CartEventValidator } = require('./cart-event-validator');
const { EventType } = require('./event-type');

class CartBootstrapStrategy {
  /**
   * @param {Object} event
   * @param {Object} context
   * @param {LoggerService} logger
   */
  process(event, context, logger) {
    logger.info('Cart event fired');

    context.isCartEvent = true;
    context.currencyCode = event.resource.obj.totalPrice.currencyCode;
  }

  /**
   * @param {Object} event
   * @returns {boolean}
   */
  validate(event) {
    return CartEventValidator.validate(event);
  }
}

class CustomerBootstrapStrategy {
  /**
   * @param {Object} event
   * @param {Object} context
   * @param {LoggerService} logger
   */
  process(event, context, logger) {
    logger.info('Customer event fired');

    context.isCustomerEvent = true;
  }

  /**
   * @param {Object} event
   * @returns {boolean}
   */
  validate(event) {
    return CustomerEventValidator.validate(event);
  }
}

class OrderBootstrapStrategy {
  /**
   * @param {Object} event
   * @param {Object} context
   * @param {LoggerService} logger
   */
  process(event, context, logger) {
    logger.info('Order event fired');

    context.isOrderEvent = true;
    context.currencyCode = event.resource.obj.totalPrice.currencyCode;
  }

  /**
   * @param {Object} event
   * @returns {boolean}
   */
  validate(event) {
    return OrderEventValidator.validate(event);
  }
}

class UnknownBootstrapStrategy {
  /**
   * @param {Object} event
   * @param {Object} context
   * @param {LoggerService} logger
   */
  process(event, context, logger) {
    logger.info('Unknown event fired');
  }

  /**
   * @returns {boolean}
   */
  validate() {
    return true;
  }
}

class BootstrapManager {
  /**
   * @param {EventType} event
   */
  constructor(event) {
    this._event = event;
    this._strategies = {
      [EventType.cart]: new CartBootstrapStrategy(),
      [EventType.customer]: new CustomerBootstrapStrategy(),
      [EventType.order]: new OrderBootstrapStrategy(),
      [EventType.unknown]: new UnknownBootstrapStrategy(),
    };
  }

  /**
   * @param {Object} event
   * @param {Object} context
   * @param {LoggerService} logger
   */
  process(event, context, logger) {
    this._strategies[this._event].process(event, context, logger);
  }

  /**
   * @param {Object} event
   * @returns {boolean}
   */
  validate(event) {
    return this._strategies[this._event].validate(event);
  }
}

module.exports = {
  BootstrapManager,
};
