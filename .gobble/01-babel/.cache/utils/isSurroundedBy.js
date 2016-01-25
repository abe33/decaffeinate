'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isSurroundedBy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _findCounterpartCharacter = require('./findCounterpartCharacter');

var _findCounterpartCharacter2 = _interopRequireDefault(_findCounterpartCharacter);

/**
 * Determines whether a node is surrounded by a matching pair of grouping
 * characters.
 *
 * @param {Object} node
 * @param {string} left
 * @param {string} source
 * @returns {boolean}
 */

function isSurroundedBy(node, left, source) {
  if (source[node.range[0] - 1] !== left) {
    return false;
  }

  return (0, _findCounterpartCharacter2['default'])(left, source, node.range[0] - 1) === node.range[1];
}

module.exports = exports['default'];