/**
 * Gets the indent string for the line containing offset.
 *
 * @param {string} source
 * @param {number} offset
 * @returns {string}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getIndent;

function getIndent(source, offset) {
  var startOfLine = getStartOfLine(source, offset);
  var indentOffset = startOfLine;
  var indentCharacter;

  switch (source[indentOffset]) {
    case ' ':
    case '\t':
      indentCharacter = source[indentOffset];
      break;

    default:
      return '';
  }

  while (source[indentOffset] === indentCharacter) {
    indentOffset++;
  }

  return source.slice(startOfLine, indentOffset);
}

/**
 * Finds the start of the line for the character at offset.
 *
 * @param {string} source
 * @param {number} offset
 * @returns {number}
 */
function getStartOfLine(source, offset) {
  var lfIndex = source.lastIndexOf('\n', offset - 1);

  if (lfIndex < 0) {
    var crIndex = source.lastIndexOf('\r', offset - 1);

    if (crIndex < 0) {
      return 0;
    }

    return crIndex + 1;
  }

  return lfIndex + 1;
}
module.exports = exports['default'];