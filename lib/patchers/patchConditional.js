'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchConditionalStart = patchConditionalStart;
exports.patchConditionalEnd = patchConditionalEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAppendClosingBrace = require('../utils/appendClosingBrace');

var _utilsAppendClosingBrace2 = _interopRequireDefault(_utilsAppendClosingBrace);

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var _utilsIsSurroundedBy = require('../utils/isSurroundedBy');

var _utilsIsSurroundedBy2 = _interopRequireDefault(_utilsIsSurroundedBy);

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

var _utilsRequiresParentheses = require('../utils/requiresParentheses');

var _utilsRequiresParentheses2 = _interopRequireDefault(_utilsRequiresParentheses);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

var UNLESS = 'unless';

/**
 * Adds punctuation to `if` statements and converts `if` expressions.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchConditionalStart(node, patcher) {
  if (node.type === 'Conditional' && (0, _utilsIsExpressionResultUsed2['default'])(node)) {
    // i.e. remove "if" or "unless"
    patcher.overwrite(node.range[0], node.condition.range[0], '');
  } else if (isUnlessConditional(node, patcher.original)) {
    patcher.overwrite(node.range[0], node.range[0] + UNLESS.length, 'if');
  } else if (isCondition(node) && (0, _utilsIsExpressionResultUsed2['default'])(node.parentNode)) {
    // nothing to do
    return;
  } else if (isCondition(node)) {
    var isSurroundedByParens = (0, _utilsIsSurroundedBy2['default'])(node, '(', patcher.original);
    var isUnless = isUnlessConditional(node.parentNode, patcher.original);
    var inserted = '';
    var offset = node.range[0];

    if (isUnless) {
      var conditionNeedsParens = (0, _utilsRequiresParentheses2['default'])(node.expression);
      if (conditionNeedsParens) {
        if (isSurroundedByParens) {
          // e.g. `unless (a + b)` -> `if (!(a + b)) {`
          inserted += '!(';
        } else {
          // e.g. `unless a + b` -> `if (!(a + b)) {`
          inserted += '(!(';
        }
      } else {
        if (isSurroundedByParens) {
          // e.g. `unless (a)` -> `if (!a) {`
          inserted += '!';
        } else {
          // e.g. `unless a` -> `if (!a) {`
          inserted += '(!';
        }
      }
    } else if (isSurroundedByParens) {
      // e.g. `if (a)` -> `if (a) {`
      inserted = '';
    } else {
      // e.g. `if a` -> `if (a) {`
      inserted += '(';
    }

    patcher.insert(offset, inserted);
  }
}

/**
 * Adds punctuation to `if` statements and converts `if` expressions.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchConditionalEnd(node, patcher) {
  if (isCondition(node)) {
    if ((0, _utilsIsExpressionResultUsed2['default'])(node.parentNode)) {
      (0, _utilsReplaceBetween2['default'])(patcher, node, node.parentNode.consequent, 'then', '?');
    } else {
      if (!(0, _utilsReplaceBetween2['default'])(patcher, node, node.parentNode.consequent, 'then ', '')) {
        (0, _utilsReplaceBetween2['default'])(patcher, node, node.parentNode.consequent, 'then', '');
      }
      var parens = (0, _utilsIsSurroundedBy2['default'])(node, '(', patcher.original);
      var inserted = parens ? ' {' : ') {';
      if (isUnlessConditional(node.parentNode, patcher.original) && (0, _utilsRequiresParentheses2['default'])(node.expression)) {
        inserted = ')' + inserted;
      }
      var nodeRange = (0, _utilsTrimmedNodeRange2['default'])(node, patcher.original);
      patcher.insert(nodeRange[1] + (parens ? ')'.length : 0), inserted);
    }
  } else if (isConsequent(node)) {
    if ((0, _utilsIsExpressionResultUsed2['default'])(node.parentNode)) {
      if (node.parentNode.alternate) {
        // e.g. `a(if b then c else d)` -> `a(b ? c : d)`
        //                     ^^^^                 ^
        (0, _utilsReplaceBetween2['default'])(patcher, node, node.parentNode.alternate, 'else', ':');
      } else {
        // e.g. `a(if b then c)` -> `a(b ? c : undefined)
        //                                  ^^^^^^^^^^^^
        var nodeRange = (0, _utilsTrimmedNodeRange2['default'])(node, patcher.original);
        patcher.insert(nodeRange[1], ' : undefined');
      }
    } else if (node.parentNode.alternate) {
      // Only add the opening curly for the alternate if it is not a conditional,
      // otherwise the handler for the end of its condition will add it.
      (0, _utilsReplaceBetween2['default'])(patcher, node, node.parentNode.alternate, 'else', '} else' + (node.parentNode.alternate.type === 'Conditional' ? '' : ' {'));
    }
  } else if (node.type === 'Conditional' && (!node.alternate || node.alternate.type !== 'Conditional')) {
    if (!(0, _utilsIsExpressionResultUsed2['default'])(node)) {
      // Close the conditional if it isn't handled by closing an `else if`.
      if (isOneLineConditionAndConsequent(node, patcher.original)) {
        var nodeRange = (0, _utilsTrimmedNodeRange2['default'])(node, patcher.original);
        patcher.insert(nodeRange[1], ' }');
      } else {
        (0, _utilsAppendClosingBrace2['default'])(node, patcher);
      }
    }
  }
}

/**
 * Determines whether a node is a Conditional node's condition.
 *
 * @param {Object} node
 * @returns {boolean}
 */
function isCondition(node) {
  return node.parentNode ? node.parentNode.type === 'Conditional' && node.parentNode.condition === node : false;
}

/**
 * @param {Object} node
 * @param {string} source
 * @returns {boolean}
 */
function isUnlessConditional(node, source) {
  return node.type === 'Conditional' && source.slice(node.range[0], node.range[0] + UNLESS.length) === UNLESS;
}

/**
 * Determines whether a node is a Conditional node's consequent.
 *
 * @param {Object} node
 * @returns {boolean}
 */
function isConsequent(node) {
  return node.parentNode ? node.parentNode.type === 'Conditional' && node.parentNode.consequent === node : false;
}

/**
 * Determines whether the condition and consequent are on the same line.
 *
 * @param {Object} node
 * @returns {boolean}
 */
function isOneLineConditionAndConsequent(node, source) {
  var condition = node.condition;
  var consequent = node.consequent;

  if (isUnlessConditional(node, source)) {
    condition = condition.expression;
  }

  return condition.line === consequent.line;
}