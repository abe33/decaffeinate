'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isExpressionResultUsed;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isImplicitlyReturned = require('./isImplicitlyReturned');

var _isImplicitlyReturned2 = _interopRequireDefault(_isImplicitlyReturned);

var _types = require('./types');

/**
 * Determines whether a node's resulting value could be used.
 *
 * @param {Object?} node
 * @returns {boolean}
 */

function isExpressionResultUsed(node) {
  if (!node) {
    return false;
  }

  if ((0, _types.isConsequentOrAlternate)(node)) {
    return false;
  }

  var parentNode = node.parentNode;
  if (parentNode.type === 'Function' && parentNode.parameters.indexOf(node) >= 0) {
    return false;
  }

  if (parentNode.type !== 'Block') {
    return true;
  }

  return (0, _isImplicitlyReturned2['default'])(node);
}

module.exports = exports['default'];