'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessNegatableOps;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

/**
 * Turn negated `of` and `instanceof` operators into standard ones.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessNegatableOps(node, patcher) {
  switch (node.type) {
    case 'OfOp':
      return standardizeNegatableOp(node, patcher, 'of');

    case 'InstanceofOp':
      return standardizeNegatableOp(node, patcher, 'instanceof');
  }
}

/**
 * Turn negated operators with a given keyword into operators surrounded by a
 * logical `not` operator.
 *
 * @param node
 * @param patcher
 * @param keyword
 * @returns {boolean}
 */
function standardizeNegatableOp(node, patcher, keyword) {
  if ((0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, 'not ' + keyword, keyword)) {
    patcher.insert(node.left.range[0], '!(');
    patcher.insert(node.right.range[1], ')');
    return true;
  } else {
    return false;
  }
}
module.exports = exports['default'];