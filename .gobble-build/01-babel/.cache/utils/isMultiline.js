/**
 * Determines whether the given node spans multiple lines.
 *
 * @param {string} source
 * @param {Object} node
 * @returns {boolean}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isMultiline;

function isMultiline(source, node) {
  var newlineIndex = source.indexOf('\n', node.range[0]);
  return newlineIndex >= 0 && newlineIndex < node.range[1];
}

module.exports = exports['default'];