'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = appendClosingBrace;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _getIndent = require('./getIndent');

var _getIndent2 = _interopRequireDefault(_getIndent);

var _isMultiline = require('./isMultiline');

var _isMultiline2 = _interopRequireDefault(_isMultiline);

var _trimmedNodeRange = require('./trimmedNodeRange');

var _trimmedNodeRange2 = _interopRequireDefault(_trimmedNodeRange);

var NEWLINE = '\n';
var SPACE = ' ';
var TAB = '\t';
var HASH = '#';

/**
 * Adds a closing curly brace on a new line after a node with the proper indent.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {number}
 */

function appendClosingBrace(node, patcher) {
  var source = patcher.original;
  var originalInsertionPoint = (0, _trimmedNodeRange2['default'])(node, source)[1];

  if (!(0, _isMultiline2['default'])(source, node)) {
    patcher.insert(originalInsertionPoint, '}');
    return originalInsertionPoint;
  }

  var insertionPoint = seekToEndOfStatementOrLine(source, originalInsertionPoint);

  patcher.insert(insertionPoint, '\n' + (0, _getIndent2['default'])(source, node.range[0]) + '}');

  return insertionPoint;
}

/**
 * Finds the last character of a statement or, if there is a comment or
 * whitespace following it on the same line, finds the end of the line.
 *
 * @param {string} source
 * @param {number} index
 * @returns {number}
 */
function seekToEndOfStatementOrLine(source, index) {
  var insideComment = false;

  while (index < source.length) {
    var char = source[index];

    if (char === NEWLINE) {
      break;
    } else if (char === HASH) {
      insideComment = true;
    } else if (!insideComment && char !== SPACE && char !== TAB) {
      break;
    }

    index++;
  }

  return index;
}
module.exports = exports['default'];