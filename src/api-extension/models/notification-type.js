'use strict';

/**
 * @see https://developers.talon.one/Integration-API/handling-effects#shownotification
 * @readonly
 * @enum {string}
 */
const NotificationType = Object.freeze({
  Info: 'Info',
  Offer: 'Offer',
  Error: 'Error',
  Misc: 'Misc',
});

module.exports = { NotificationType };
