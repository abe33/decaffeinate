'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = shouldHaveTrailingSemicolon;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var _utilsIsImplicitlyReturned = require('../utils/isImplicitlyReturned');

var _utilsIsImplicitlyReturned2 = _interopRequireDefault(_utilsIsImplicitlyReturned);

/**
 * Determines whether a node should have a semicolon after it.
 *
 * @param {Object} node
 * @returns {boolean}
 */

function shouldHaveTrailingSemicolon(node) {
  var parentNode = node.parentNode;

  if (!parentNode) {
    return false;
  }

  switch (parentNode.type) {
    case 'Block':
      break;

    case 'Function':
      if (parentNode.body !== node) {
        return false;
      }
      break;

    case 'Class':
      return false;

    case 'Conditional':
      if (node.type === 'Block') {
        return false;
      } else if (parentNode.condition === node) {
        return false;
      } else if ((0, _utilsIsExpressionResultUsed2['default'])(parentNode)) {
        // No semicolons in "a ? b : c" from "if a then b else c".
        return false;
      }
      break;

    default:
      if (parentNode && parentNode.type === 'Try') {
        if (node === parentNode.body && node.type !== 'Block') {
          // Add a semicolon after the single-statement `try` body.
          return true;
        }
      }
      return false;
  }

  switch (node.type) {
    case 'Block':
    case 'ClassProtoAssignOp':
    case 'Conditional':
    case 'Constructor':
    case 'ForIn':
    case 'ForOf':
    case 'JavaScript':
    case 'Try':
    case 'While':
    case 'Switch':
      return false;

    case 'Class':
      return !node.nameAssignee || (0, _utilsIsImplicitlyReturned2['default'])(node);

    default:
      return true;
  }
}

module.exports = exports['default'];