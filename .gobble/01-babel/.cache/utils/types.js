/**
 * Determines whether a node represents a function, i.e. `->` or `=>`.
 *
 * @param {Object} node
 * @returns {boolean}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isFunction = isFunction;
exports.isForLoop = isForLoop;
exports.isWhile = isWhile;
exports.isConsequentOrAlternate = isConsequentOrAlternate;
exports.isBinaryOperator = isBinaryOperator;

function isFunction(node) {
  return node.type === 'Function' || node.type === 'BoundFunction';
}

/**
 * Determines whether a node represents a `for` loop.
 *
 * @param {Object} node
 * @returns {boolean}
 */

function isForLoop(node) {
  return node.type === 'ForIn' || node.type === 'ForOf';
}

/**
 * Determines whether a node represents a `while` loop.
 *
 * @param {Object} node
 * @returns {boolean}
 */

function isWhile(node) {
  return node.type === 'While';
}

/**
 * Determines whether a node is the true-part or false-part of a conditional.
 *
 * @param {Object} node
 * @returns {boolean}
 */

function isConsequentOrAlternate(node) {
  var parentNode = node.parentNode;
  return parentNode.type === 'Conditional' && (parentNode.consequent === node || parentNode.alternate === node);
}

/**
 * @param {Object} node
 * @returns {boolean}
 */

function isBinaryOperator(node) {
  switch (node.type) {
    case 'DivideOp':
    case 'EQOp':
    case 'GTEOp':
    case 'GTOp':
    case 'InOp':
    case 'InstanceofOp':
    case 'LTEOp':
    case 'LTOp':
    case 'LogicalAndOp':
    case 'MultiplyOp':
    case 'NEQOp':
    case 'OfOp':
    case 'PlusOp':
    case 'RemOp':
      return true;

    default:
      return false;
  }
}