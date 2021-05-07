'use strict';
const { NotificationType } = require('./notification-type');

class Notification {
  /**
   * @param {string} type
   * @param {string} title
   * @param {string} body
   * @param {string} effect
   * @param {string} code
   */
  constructor(type, title, body, effect, code = '') {
    if (!Object.values(NotificationType).includes(type)) {
      throw new Error('Unsupported notification type.');
    }

    this.type = type;
    this.title = title;
    this.body = body;
    this.effect = effect;
    this.code = code;
  }

  toObject() {
    return {
      type: this.type,
      title: this.title,
      body: this.body,
      effect: this.effect,
      code: this.code,
    };
  }
}

class InfoNotification extends Notification {
  /**
   * @param {string} title
   * @param {string} body
   * @param {string} effect
   * @param {string} code
   */
  constructor(title, body, effect, code = '') {
    super(NotificationType.Info, title, body, effect, code);
  }
}

class OfferNotification extends Notification {
  /**
   * @param {string} title
   * @param {string} body
   * @param {string} effect
   * @param {string} code
   */
  constructor(title, body, effect, code = '') {
    super(NotificationType.Offer, title, body, effect, code);
  }
}

class ErrorNotification extends Notification {
  /**
   * @param {string} title
   * @param {string} body
   * @param {string} effect
   * @param {string} code
   */
  constructor(title, body, effect, code = '') {
    super(NotificationType.Error, title, body, effect, code);
  }
}

class MiscNotification extends Notification {
  /**
   * @param {string} title
   * @param {string} body
   * @param {string} effect
   * @param {string} code
   */
  constructor(title, body, effect, code = '') {
    super(NotificationType.Misc, title, body, effect, code);
  }
}

module.exports = {
  Notification,
  InfoNotification,
  OfferNotification,
  ErrorNotification,
  MiscNotification,
};
