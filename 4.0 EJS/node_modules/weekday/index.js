/**
 * weekday <https://github.com/jonschlinkert/weekday>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var isNumber = require('is-number');
var days = require('days');

module.exports = function (num) {
  var day = new Date().getDay();

  if (typeof num === 'undefined') {
    num = day + 1;
  }

  if (isNumber(+num)) {
    return days[num - 1];
  }

  if (typeof num !== 'string') {
    throw new Error('[weekday] expects a string or number, but got: ' + num);
  }

  return days.indexOf(num);
};
