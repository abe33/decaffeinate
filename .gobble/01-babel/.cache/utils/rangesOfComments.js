'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = rangesOfComments;
var NORMAL = 0;
var LINE_COMMENT = 1;
var BLOCK_COMMENT = 2;
var DQUOTE = 3;
var SQUOTE = 4;
var NEWLINE_CODE = 10;
var HASH_CODE = 35;
var DQUOTE_CODE = 34;
var SQUOTE_CODE = 39;
var SLASH_CODE = 92;

/**
 * Returns the ranges of the sections of source code that are not comments.
 *
 * @param {string} source
 * @returns {Array.<{start: number, end: number, type: string}>}
 */

function rangesOfComments(source) {
  var result = [];
  var index = 0;
  var end = source.length;
  var state = 0;

  var rangeStart = 0;

  while (index < end) {
    var c = source.charCodeAt(index);

    switch (state) {
      case NORMAL:
        if (c === HASH_CODE) {
          rangeStart = index;
          if (source.slice(index, index + 4) === '###\n') {
            state = BLOCK_COMMENT;
            index += 3;
          } else {
            state = LINE_COMMENT;
          }
        } else if (c === DQUOTE_CODE) {
          state = DQUOTE;
        } else if (c === SQUOTE_CODE) {
          state = SQUOTE;
        }
        break;

      case LINE_COMMENT:
        if (c === NEWLINE_CODE) {
          addComment();
          state = NORMAL;
        }
        break;

      case BLOCK_COMMENT:
        if (c === HASH_CODE) {
          if (source.slice(index, index + 4) === '###\n') {
            index += 3;
            addComment();
            state = NORMAL;
          } else if (source.slice(index, index + 4) === '###' /* EOF */) {
              index += 3;
              addComment();
              state = NORMAL;
            }
        }
        break;

      case DQUOTE:
        if (c === DQUOTE_CODE) {
          state = NORMAL;
        } else if (c === SLASH_CODE) {
          index++;
        }
        break;

      case SQUOTE:
        if (c === SQUOTE_CODE) {
          state = NORMAL;
        } else if (c === SLASH_CODE) {
          index++;
        }
        break;
    }

    index++;
  }

  if (state === LINE_COMMENT || state === BLOCK_COMMENT) {
    addComment();
  }

  function addComment() {
    var type = undefined;

    // Check for shebang lines.
    if (state === BLOCK_COMMENT) {
      type = 'block';
    } else if (rangeStart === 0 && source[1] === '!') {
      type = 'shebang';
    } else {
      type = 'line';
    }

    result.push({ start: rangeStart, end: index, type: type });
  }

  return result;
}

module.exports = exports['default'];