'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchEquality;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

/**
 * Replaces equality operators with strict equality operators.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchEquality(node, patcher) {
  switch (node.type) {
    case 'EQOp':
      if (!(0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, '==', '===')) {
        (0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, 'is', '===');
      }
      break;

    case 'NEQOp':
      if (!(0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, '!=', '!==')) {
        (0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, 'isnt', '!==');
      }
      break;
  }
}

module.exports = exports['default'];