'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessWhile;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsConvertLoopExpressionIntoIIFE = require('../utils/convertLoopExpressionIntoIIFE');

var _utilsConvertLoopExpressionIntoIIFE2 = _interopRequireDefault(_utilsConvertLoopExpressionIntoIIFE);

var _utilsEnsureMultilineLoop = require('../utils/ensureMultilineLoop');

var _utilsEnsureMultilineLoop2 = _interopRequireDefault(_utilsEnsureMultilineLoop);

var _utilsRequiresParentheses = require('../utils/requiresParentheses');

var _utilsRequiresParentheses2 = _interopRequireDefault(_utilsRequiresParentheses);

var _utilsTypes = require('../utils/types');

var LOOP_KEYWORD = 'loop';
var UNTIL_KEYWORD = 'until';
var WHILE_KEYWORD = 'while';

/**
 * Convert non-standard `while` loops into typical loops.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessWhile(node, patcher) {
  if ((0, _utilsTypes.isWhile)(node)) {
    if (convertLoopToWhileTrue(node, patcher)) {
      return true;
    } else if (convertUntilToWhile(node, patcher)) {
      return true;
    } else if ((0, _utilsEnsureMultilineLoop2['default'])(node, patcher)) {
      return true;
    } else if ((0, _utilsConvertLoopExpressionIntoIIFE2['default'])(node, patcher)) {
      return true;
    }
  }
}

/**
 * Convert `loop` into `while true`.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */
function convertLoopToWhileTrue(node, patcher) {
  if ((0, _utilsTypes.isWhile)(node) && patcher.slice(node.range[0], node.range[0] + LOOP_KEYWORD.length) === LOOP_KEYWORD) {
    patcher.overwrite(node.range[0], node.range[0] + LOOP_KEYWORD.length, 'while true');
    return true;
  }

  return false;
}

/**
 * Convert `until` into a negated `while`.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */
function convertUntilToWhile(node, patcher) {
  if ((0, _utilsTypes.isWhile)(node) && patcher.slice(node.range[0], node.range[0] + UNTIL_KEYWORD.length) === UNTIL_KEYWORD) {
    // Handle "until" loops.
    patcher.overwrite(node.range[0], node.range[0] + UNTIL_KEYWORD.length, WHILE_KEYWORD);
    var condition = node.condition.expression;
    if ((0, _utilsRequiresParentheses2['default'])(condition)) {
      patcher.insert(condition.range[0], '!(');
      patcher.insert(condition.range[1], ')');
    } else {
      patcher.insert(condition.range[0], '!');
    }
    return true;
  }
}
module.exports = exports['default'];