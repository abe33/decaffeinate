'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = adjustIndent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _determineIndent = require('./determineIndent');

var _determineIndent2 = _interopRequireDefault(_determineIndent);

var _getIndent = require('./getIndent');

var _getIndent2 = _interopRequireDefault(_getIndent);

/**
 * Adjust an indent in source at a specific offset by an amount.
 *
 * @param {string} source
 * @param {number} offset
 * @param {number} adjustment
 * @returns {string}
 */

function adjustIndent(source, offset, adjustment) {
  var currentIndent = (0, _getIndent2['default'])(source, offset);
  var determinedIndent = (0, _determineIndent2['default'])(source);

  if (adjustment > 0) {
    while (adjustment--) {
      currentIndent += determinedIndent;
    }
  } else if (adjustment < 0) {
    currentIndent = currentIndent.slice(determinedIndent.length * -adjustment);
  }

  return currentIndent;
}

module.exports = exports['default'];