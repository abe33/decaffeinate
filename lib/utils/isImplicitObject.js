/**
 * @param {Object} node
 * @param {string} source
 * @returns {boolean}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isImplicitObject;

function isImplicitObject(node, source) {
  return node && node.type === 'ObjectInitialiser' && source[node.range[0]] !== '{';
}

module.exports = exports['default'];