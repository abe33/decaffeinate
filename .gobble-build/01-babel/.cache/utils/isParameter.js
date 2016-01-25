/**
 * @param {Object} node
 * @returns {boolean}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isParameter;

function isParameter(node) {
  if (!node) {
    return false;
  }

  var parentNode = node.parentNode;

  if (!parentNode) {
    return false;
  }

  if (parentNode.type !== 'Function' && parentNode.type !== 'BoundFunction') {
    return false;
  }

  return parentNode.parameters.indexOf(node) >= 0;
}

module.exports = exports['default'];