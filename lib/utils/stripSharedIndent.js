'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = stripSharedIndent;
var WHITESPACE = /^\s*$/;

/**
 * Removes indentation shared by all lines.
 *
 * @param {string} source
 * @returns {string}
 */

function stripSharedIndent(source) {
  var lines = source.split('\n');

  while (lines.length > 0 && WHITESPACE.test(lines[0])) {
    lines.shift();
  }
  while (lines.length > 0 && WHITESPACE.test(lines[lines.length - 1])) {
    lines.pop();
  }

  var minimumIndent = lines.reduce(function (indent, line) {
    if (line.length === 0) {
      return indent;
    } else {
      return Math.min(getIndent(line), indent);
    }
  }, Infinity);

  return lines.map(function (line) {
    return line.slice(minimumIndent);
  }).join('\n');
}

/**
 * Determines the indentation in number of spaces of a line.
 *
 * @param {string} line
 * @returns {number}
 */
function getIndent(line) {
  var index = 0;
  while (line[index] === ' ') {
    index++;
  }
  return index;
}
module.exports = exports['default'];