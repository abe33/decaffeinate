'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = replaceBetween;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sourceBetween = require('./sourceBetween');

var _sourceBetween2 = _interopRequireDefault(_sourceBetween);

/**
 * Replace part of the text between the given nodes with a new string.
 *
 * @param {MagicString} patcher
 * @param {Object} left
 * @param {Object} right
 * @param {string} search
 * @param {string} replacement
 * @returns {boolean}
 */

function replaceBetween(patcher, left, right, search, replacement) {
  var between = (0, _sourceBetween2['default'])(patcher.original, left, right);
  var offset = between.indexOf(search);

  if (offset < 0) {
    return false;
  }

  patcher.overwrite(left.range[1] + offset, left.range[1] + offset + search.length, replacement);
  return true;
}

module.exports = exports['default'];