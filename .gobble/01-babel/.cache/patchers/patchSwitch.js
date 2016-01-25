'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchSwitchStart = patchSwitchStart;
exports.patchSwitchEnd = patchSwitchEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAdjustIndent = require('../utils/adjustIndent');

var _utilsAdjustIndent2 = _interopRequireDefault(_utilsAdjustIndent);

var _utilsAppendClosingBrace = require('../utils/appendClosingBrace');

var _utilsAppendClosingBrace2 = _interopRequireDefault(_utilsAppendClosingBrace);

var _utilsIsImplicitlyReturned = require('../utils/isImplicitlyReturned');

var _utilsIsImplicitlyReturned2 = _interopRequireDefault(_utilsIsImplicitlyReturned);

var _utilsIsMultiline = require('../utils/isMultiline');

var _utilsIsMultiline2 = _interopRequireDefault(_utilsIsMultiline);

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

/**
 * Patches rest parameters.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchSwitchStart(node, patcher) {
  var parentNode = node.parentNode;

  if (isExpressionlessSwitch(node)) {
    // e.g. `switch` by itself. we add '{' here because there's no expression to add it after in patchSwitchEnd.
    patcher.insert(node.range[0] + 'switch'.length, ' (false) {');
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.expression) {
    // e.g. `switch a` -> `switch (a`
    patcher.insert(node.range[0], '(');
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.alternate) {
    // e.g. `else` -> `default:`
    var lastCase = parentNode.cases[parentNode.cases.length - 1];
    (0, _utilsReplaceBetween2['default'])(patcher, lastCase, node, 'else', 'default:');
  } else if (node.type === 'SwitchCase') {
    // e.g. `when a` -> `case a`
    var caseString = isExpressionlessSwitch(parentNode) ? 'case !(' : 'case ';
    patcher.overwrite(node.range[0], node.range[0] + 'when '.length, caseString);
  } else if (parentNode && parentNode.type === 'SwitchCase') {
    var conditionIndex = parentNode.conditions.indexOf(node);
    if (conditionIndex >= 1) {
      // e.g. in `when a, b` changes `, b` -> ` case b`
      var previousCondition = parentNode.conditions[conditionIndex - 1];
      var caseString = isExpressionlessSwitch(parentNode.parentNode) ? ' case !(' : ' case ';
      if (!(0, _utilsReplaceBetween2['default'])(patcher, previousCondition, node, ', ', caseString)) {
        (0, _utilsReplaceBetween2['default'])(patcher, previousCondition, node, ',', caseString);
      }
    } else if (conditionIndex < 0) {
      // `when` body
      if (!(0, _utilsIsMultiline2['default'])(patcher.original, parentNode)) {
        // e.g. removes `then ` in `when a then b`
        (0, _utilsReplaceBetween2['default'])(patcher, parentNode.conditions[parentNode.conditions.length - 1], node, 'then ', '');
      }
    }
  }
}

/**
 * Patches rest parameters.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchSwitchEnd(node, patcher) {
  var parentNode = node.parentNode;

  if (node.type === 'Switch') {
    // close the switch block
    (0, _utilsAppendClosingBrace2['default'])(node, patcher);
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.expression) {
    // close the switch expression and start the switch block
    patcher.insert(node.range[1], ') {');
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.alternate) {
    if (node.type !== 'Block') {
      // e.g. in `else a` adds `;` after `a`
      patcher.insert(node.range[1], ';');
    }
  } else if (parentNode && parentNode.type === 'SwitchCase') {
    var conditionIndex = parentNode.conditions.indexOf(node);
    if (conditionIndex >= 0) {
      // e.g. in `when a, b` adds `:` after `a` and `b`
      //      or, for expression-less switches, closes the negating parentheses too
      patcher.insert(node.range[1], isExpressionlessSwitch(parentNode.parentNode) ? '):' : ':');
    } else if (node === parentNode.consequent) {
      if ((0, _utilsIsMultiline2['default'])(patcher.original, parentNode)) {
        if (!(0, _utilsIsImplicitlyReturned2['default'])(node.statements[node.statements.length - 1])) {
          // adds `break;` on a new line
          var trimmedRange = (0, _utilsTrimmedNodeRange2['default'])(node, patcher.original);
          patcher.insert(trimmedRange[1], '\n' + (0, _utilsAdjustIndent2['default'])(patcher.original, parentNode.range[0], 1) + 'break;');
        }
      } else {
        // e.g. in `when a then b` adds `; break;` after `b`
        patcher.insert(node.range[1], (0, _utilsIsImplicitlyReturned2['default'])(node) ? ';' : '; break;');
      }
    }
  }
}

/**
 * @param {Object} node
 * @returns {boolean}
 */
function isExpressionlessSwitch(node) {
  return node.type === 'Switch' && !node.expression;
}