'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isStatement;

var _types = require('./types');

/**
 * Determines whether the given node is a statement.
 *
 * @param {Object} node
 * @returns {boolean}
 */

function isStatement(node) {
  if (!node || !node.parentNode) {
    return false;
  }

  if (node.parentNode.type !== 'Block') {
    return false;
  }

  if ((0, _types.isFunction)(node.parentNode.parentNode)) {
    // If it's the last statement then it's an implicit return.
    var statements = node.parentNode.statements;
    return statements[statements.length - 1] !== node;
  }

  // It's inside a block, but not the last statement of a function,
  // so it's a statement.
  return true;
}

module.exports = exports['default'];