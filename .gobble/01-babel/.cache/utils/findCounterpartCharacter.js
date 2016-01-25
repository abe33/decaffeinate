/**
 * Finds the counterpart character index to balance out the character at index.
 *
 * @example
 *
 *   findCounterpartCharacter('(', '((a) -> a(1, 2))', 0) // 15
 *
 * @param {string} character
 * @param {string} source
 * @param {number} index
 * @returns {number}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = findCounterpartCharacter;

function findCounterpartCharacter(character, source) {
  var index = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var counterpart = getCounterpart(character);
  var length = source.length;

  for (var level = 0; index < length; index++) {
    switch (source[index]) {
      case counterpart:
        level--;
        if (level === 0) {
          return index;
        }
        break;

      case character:
        level++;
        break;
    }
  }

  return -1;
}

/**
 * @param {string} character
 * @returns {string}
 */
function getCounterpart(character) {
  switch (character) {
    case '(':
      return ')';

    case '{':
      return '}';

    case '[':
      return ']';

    default:
      throw new Error('No known counterpart for character: ' + character);
  }
}
module.exports = exports['default'];