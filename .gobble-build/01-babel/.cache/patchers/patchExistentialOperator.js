/**
 * Prepares the start of an existential operator node.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchExistentialOperatorStart = patchExistentialOperatorStart;
exports.patchExistentialOperatorEnd = patchExistentialOperatorEnd;

function patchExistentialOperatorStart(node, patcher) {
  if (node.type === 'UnaryExistsOp') {
    var expression = node.expression;
    if (expression.type !== 'Identifier' && needsParens(node)) {
      patcher.insert(node.range[0], '(');
    }
  }
}

/**
 * Prepares the start of an existential operator node.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchExistentialOperatorEnd(node, patcher) {
  if (node.type === 'UnaryExistsOp') {
    var expression = node.expression;
    var parens = needsParens(node);
    if (expression.type === 'Identifier') {
      var checked = expression.data;
      var replacement = 'typeof ' + checked + ' !== "undefined" && ' + checked + ' !== null';
      if (parens) {
        replacement = '(' + replacement + ')';
      }
      patcher.overwrite(node.range[0], node.range[1], replacement);
    } else {
      var replacement = ' != null';
      if (parens) {
        replacement += ')';
      }
      patcher.overwrite(node.range[1] - 1, node.range[1], replacement);
    }
  }
}

/**
 * Determines whether the given node needs parentheses.
 *
 * @param {Object} node
 * @returns {boolean}
 */
function needsParens(node) {
  return node.parentNode.type !== 'Block';
}