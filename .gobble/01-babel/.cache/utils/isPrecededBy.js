/**
 * Determines whether a node is preceded by a particular token.
 *
 * @param {Object} node
 * @param {string} source
 * @param {string} token
 * @returns {boolean}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isPrecededBy;

function isPrecededBy(node, source, token) {
  var index = node.range[1] - token.length;

  while (index >= 0) {
    if (source.slice(index, index + token.length) === token) {
      return true;
    } else if (source[index] === ' ' || source[index] === '\n' || source[index] === '\t') {
      index--;
    } else {
      break;
    }
  }

  return false;
}

module.exports = exports['default'];