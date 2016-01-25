/**
 * Determines whether the given node, when used as part of a larger expression
 * node, would require parentheses around it.
 *
 * @param {Object} node
 * @returns {boolean}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = requiresParentheses;

function requiresParentheses(node) {
  switch (node.type) {
    case 'AssignOp':
    case 'BitAndOp':
    case 'BitOrOp':
    case 'BitXorOp':
    case 'EQOp':
    case 'GTEOp':
    case 'GTOp':
    case 'LTEOp':
    case 'LTOp':
    case 'LogicalAndOp':
    case 'LogicalOrOp':
    case 'NEQOp':
    case 'PlusOp':
    case 'SubtractOp':
      return true;

    default:
      return false;
  }
}

module.exports = exports['default'];