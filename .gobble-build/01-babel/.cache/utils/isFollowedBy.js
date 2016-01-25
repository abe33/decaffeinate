/**
 * Determines whether a node is followed by a particular token.
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
exports['default'] = isFollowedBy;

function isFollowedBy(node, source, token) {
  var index = node.range[1];

  while (index < source.length) {
    if (source.slice(index, index + token.length) === token) {
      return true;
    } else if (source[index] === ' ' || source[index] === '\n' || source[index] === '\t') {
      index++;
    } else {
      break;
    }
  }

  return false;
}

module.exports = exports['default'];