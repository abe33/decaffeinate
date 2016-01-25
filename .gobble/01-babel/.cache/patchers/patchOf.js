'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchOf;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchOf(node, patcher) {
  if (node.type === 'OfOp') {
    (0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, 'of', 'in');
  }
}

module.exports = exports['default'];