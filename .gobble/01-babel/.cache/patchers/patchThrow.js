'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchThrowStart = patchThrowStart;
exports.patchThrowEnd = patchThrowEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var LPAREN = '(';
var RPAREN = ')';

/**
 * Wraps throw expressions in an IIFE.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchThrowStart(node, patcher) {
  if (isThrowExpression(node)) {
    var pos = node.range[0];
    var str = '() => { ';
    if (patcher.original.slice(pos - LPAREN.length, pos) !== LPAREN) {
      // Doesn't start with a parenthesis, so add it to the start.
      str += LPAREN;
    }
    patcher.insert(pos, str);
  }
}

/**
 * Wraps throw expressions in an IIFE.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchThrowEnd(node, patcher) {
  if (isThrowExpression(node)) {
    var pos = node.range[1];
    var str = '; })(';
    if (patcher.slice(pos, pos + RPAREN.length) !== RPAREN) {
      // Doesn't end with a parenthesis, so add it to the end.
      str += RPAREN;
    }
    patcher.insert(pos, str);
  }
}

/**
 * Determines whether a node is a `throw` used in an expression context.
 *
 * @param {Object} node
 * @returns {boolean}
 */
function isThrowExpression(node) {
  if (node.type !== 'Throw') {
    return false;
  }

  switch (node.parentNode.type) {
    case 'Block':
      return false;

    case 'Function':
    case 'BoundFunction':
      return node.parentNode.body !== node;

    case 'Conditional':
      return (0, _utilsIsExpressionResultUsed2['default'])(node.parentNode);

    default:
      return true;
  }
}