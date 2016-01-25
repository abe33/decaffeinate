'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchComments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsRangesOfComments = require('../utils/rangesOfComments');

var _utilsRangesOfComments2 = _interopRequireDefault(_utilsRangesOfComments);

/**
 * Replaces CoffeeScript style comments with JavaScript style comments.
 *
 * @param {MagicString} patcher
 */

function patchComments(patcher) {
  var source = patcher.original;
  var ranges = (0, _utilsRangesOfComments2['default'])(source);

  ranges.forEach(function (comment) {
    switch (comment.type) {
      case 'line':
        patchLineComment(patcher, comment);
        break;

      case 'block':
        patchBlockComment(patcher, comment);
        break;

      case 'shebang':
        patchShebangComment(patcher, comment);
        break;
    }
  });
}

/**
 * Patches a single-line comment.
 *
 * @param {MagicString} patcher
 * @param {{start: number, end: number, type: string}} range
 * @private
 */
function patchLineComment(patcher, range) {
  patcher.overwrite(range.start, range.start + '#'.length, '//');
}

/**
 * Patches a block comment.
 *
 * @param {MagicString} patcher
 * @param {{start: number, end: number, type: string}} range
 * @private
 */
function patchBlockComment(patcher, range) {
  var start = range.start;
  var end = range.end;

  var commentBody = patcher.slice(start, end);
  var comment = parseBlockComment(commentBody);

  if (comment.doc) {
    (function () {
      patcher.overwrite(start, start + comment.head.length, '/**\n');
      var index = start + comment.head.length;
      comment.lines.forEach(function (line) {
        var indent = line.indexOf('#');
        patcher.overwrite(index + indent, index + indent + '#'.length, ' *');
        index += line.length;
      });
      patcher.overwrite(end - comment.tail.length, end, ' */');
    })();
  } else {
    patcher.overwrite(start, start + comment.head.length, '/*\n');
    patcher.overwrite(end - comment.tail.length, end, '*/');
  }
}

/**
 * @param blockComment
 * @returns {{head: string, tail: string, body: string, lines: string[], doc: boolean}}
 * @private
 */
function parseBlockComment(blockComment) {
  var endOfHead = blockComment.indexOf('\n') + 1;
  var lastLineStart = blockComment.lastIndexOf('\n') + 1;
  var startOfTail = blockComment.indexOf('#', lastLineStart);
  var head = blockComment.slice(0, endOfHead);
  var tail = blockComment.slice(startOfTail);
  var body = blockComment.slice(endOfHead, startOfTail);
  var lines = [];

  var newlineIndex = endOfHead - 1;
  while (newlineIndex + 1 < startOfTail) {
    var nextNewlineIndex = blockComment.indexOf('\n', newlineIndex + 1);
    if (nextNewlineIndex < 0) {
      break;
    } else if (nextNewlineIndex > newlineIndex) {
      lines.push(blockComment.slice(newlineIndex + 1, nextNewlineIndex + 1));
    }
    newlineIndex = nextNewlineIndex;
  }

  var doc = lines.every(function (line) {
    return (/^ *#/.test(line)
    );
  });

  return { head: head, tail: tail, body: body, lines: lines, doc: doc };
}

/**
 * Patches a shebang comment.
 *
 * @param {MagicString} patcher
 * @param {{start: number, end: number, type: string}} range
 * @private
 */
function patchShebangComment(patcher, range) {
  var start = range.start;
  var end = range.end;

  var commentBody = patcher.slice(start, end);
  var coffeeIndex = commentBody.indexOf('coffee');

  if (coffeeIndex >= 0) {
    patcher.overwrite(start + coffeeIndex, start + coffeeIndex + 'coffee'.length, 'node');
  }
}
module.exports = exports['default'];