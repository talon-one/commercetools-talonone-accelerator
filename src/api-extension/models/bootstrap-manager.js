'use strict';
const { LoggerService } = require('../services/logger');
const { CustomerEventValidator } = require('./customer-event-validator');
const { OrderEventValidator } = require('./order-event-validator');
const { CartEventValidator } = require('./cart-event-validator');
const { EventType } = require('./event-type');
const { EventValidationMode } = require('./event-validation-mode');

class CartBootstrapStrategy {
  /**
   * @param {CtpCartEvent} event
   * @param {Object} context
   */
  process(event, context) {
    context.isCartEvent = true;
    context.currencyCode = event.resource.obj.totalPrice.currencyCode;
  }

  /**
   * @param {Object} event
   * @return {boolean}
   */
  simpleValidation(event) {
    return ['Update', 'Create'].includes(event?.action);
  }

  /**
   * @param {Object} event
   * @return {boolean}
   */
  schemaValidation(event) {
    return CartEventValidator.validate(event);
  }
}

class CustomerBootstrapStrategy {
  /**
   * @param {CtpCustomerEvent} event
   * @param {Object} context
   */
  process(event, context) {
    context.isCustomerEvent = true;
  }

  /**
   * @param {Object} event
   * @return {boolean}
   */
  simpleValidation(event) {
    return ['Update', 'Create'].includes(event?.action);
  }

  /**
   * @param {Object} event
   * @return {boolean}
   */
  schemaValidation(event) {
    return CustomerEventValidator.validate(event);
  }
}

class OrderBootstrapStrategy {
  /**
   * @param {CtpOrderEvent} event
   * @param {Object} context
   */
  process(event, context) {
    context.isOrderEvent = true;
    context.currencyCode = event.resource.obj.totalPrice.currencyCode;
  }

  /**
   * @param {Object} event
   * @return {boolean}
   */
  simpleValidation(event) {
    return ['Update', 'Create'].includes(event?.action);
  }

  /**
   * @param {Object} event
   * @return {boolean}
   */
  schemaValidation(event) {
    return OrderEventValidator.validate(event);
  }
}

class UnknownBootstrapStrategy {
  process() {}

  /**
   * @return {boolean}
   */
  simpleValidation() {
    return true;
  }

  /**
   * @return {boolean}
   */
  schemaValidation() {
    return true;
  }
}

class BootstrapManager {
  /**
   * @param {EventType} eventType
   * @param {EventValidationMode} validationMode
   * @param {LoggerService} logger
   */
  constructor(eventType, validationMode, logger) {
    if (!EventType.isValid(eventType)) {
      throw new Error('Invalid event type.');
    }

    if (!EventValidationMode.isValid(validationMode)) {
      throw new Error('Invalid event validation mode.');
    }

    if (!(logger instanceof LoggerService)) {
      throw new Error('Invalid logger type.');
    }

    this._eventType = eventType;
    this._validationMode = validationMode;
    this._logger = logger;

    this._strategies = {
      [EventType.CART]: new CartBootstrapStrategy(),
      [EventType.CUSTOMER]: new CustomerBootstrapStrategy(),
      [EventType.ORDER]: new OrderBootstrapStrategy(),
      [EventType.UNKNOWN]: new UnknownBootstrapStrategy(),
    };

    this._bootstrap = this._strategies[this._eventType];
  }

  /**
   * @param {Object} event
   * @param {Object} context
   */
  process(event, context) {
    this._logger.info(`BootstrapManager processing ${this._eventType}`);
    this._bootstrap.process(event, context);
  }

  /**
   * @param {Object} event
   * @return {boolean}
   */
  validate(event) {
    switch (this._validationMode) {
      case EventValidationMode.SIMPLE:
        return this._bootstrap.simpleValidation(event);

      case EventValidationMode.JSON_SCHEMA:
        return this._bootstrap.schemaValidation(event);

      default:
        return false;
    }
  }
}

module.exports = {
  BootstrapManager,
};
