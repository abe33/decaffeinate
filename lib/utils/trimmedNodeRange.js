'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = trimmedNodeRange;
var COMMENT = {};
var DSTRING = {};
var NORMAL = {};
var SSTRING = {};

/**
 * Gets the range of the node by trimming whitespace and comments off the end.
 * CoffeeScriptRedux parses nodes by consuming up until the start of the next
 * node, so any whitespace or comments following a node end up as part of its
 * range. This tries to remove those trailing whitespace and comments.
 *
 * @param {Object} node
 * @param {string} source
 * @returns {number[]}
 */

function trimmedNodeRange(node, source) {
  var range = node.range;
  var index = range[0];
  var state = NORMAL;
  var lastSignificantIndex = undefined;

  while (range[0] <= index && index < range[1]) {
    switch (source[index]) {
      case ' ':
      case '\t':
        break;

      case '\n':
      case '\r':
        state = NORMAL;
        break;

      case '#':
        if (state === NORMAL) {
          state = COMMENT;
        }
        break;

      case '"':
        if (state === NORMAL) {
          state = DSTRING;
          lastSignificantIndex = index;
        } else if (state === DSTRING) {
          state = NORMAL;
          lastSignificantIndex = index;
        }
        break;

      case "'":
        if (state === NORMAL) {
          state = SSTRING;
          lastSignificantIndex = index;
        } else if (state === SSTRING) {
          state = NORMAL;
          lastSignificantIndex = index;
        }
        break;

      default:
        if (state === NORMAL) {
          lastSignificantIndex = index;
        }
        break;
    }

    index++;
  }

  return [range[0], lastSignificantIndex + 1];
}

module.exports = exports['default'];