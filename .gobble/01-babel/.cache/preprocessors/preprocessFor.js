'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessFor;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsConvertLoopExpressionIntoIIFE = require('../utils/convertLoopExpressionIntoIIFE');

var _utilsConvertLoopExpressionIntoIIFE2 = _interopRequireDefault(_utilsConvertLoopExpressionIntoIIFE);

var _utilsEnsureMultilineLoop = require('../utils/ensureMultilineLoop');

var _utilsEnsureMultilineLoop2 = _interopRequireDefault(_utilsEnsureMultilineLoop);

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsGetIndent = require('../utils/getIndent');

var _utilsGetIndent2 = _interopRequireDefault(_utilsGetIndent);

var _utilsIndentNode = require('../utils/indentNode');

var _utilsIndentNode2 = _interopRequireDefault(_utilsIndentNode);

var _utilsIsSafeToRepeat = require('../utils/isSafeToRepeat');

var _utilsIsSafeToRepeat2 = _interopRequireDefault(_utilsIsSafeToRepeat);

var _utilsPrependLinesToBlock = require('../utils/prependLinesToBlock');

var _utilsPrependLinesToBlock2 = _interopRequireDefault(_utilsPrependLinesToBlock);

var _utilsTypes = require('../utils/types');

/**
 * Normalize `for` loops for easier patching.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessFor(node, patcher) {
  if ((0, _utilsTypes.isForLoop)(node)) {
    if ((0, _utilsEnsureMultilineLoop2['default'])(node, patcher)) {
      return true;
    } else if ((0, _utilsConvertLoopExpressionIntoIIFE2['default'])(node, patcher)) {
      return true;
    } else if (convertFilterIntoBodyConditional(node, patcher)) {
      return true;
    } else if (moveValueAssignmentIntoBody(node, patcher)) {
      return true;
    } else if (convertForOwnIntoBodyConditional(node, patcher)) {
      return true;
    }
  }

  var target = node.target;
  var scope = node.scope;

  if (node.type === 'ForIn') {
    var rewritten = false;

    // Make all for-in loops have a key assignee.
    if (!node.keyAssignee && target.type !== 'Range') {
      patcher.insert(node.valAssignee.range[1], ', ' + (0, _utilsGetFreeBinding.getFreeLoopBinding)(scope));
      rewritten = true;
    }

    if (target.type === 'Range') {
      if (!(0, _utilsIsSafeToRepeat2['default'])(target.left)) {
        var startBinding = (0, _utilsGetFreeBinding2['default'])(scope, 'start');
        patcher.insert(node.range[0], startBinding + ' = ' + target.left.raw + '\n' + (0, _utilsGetIndent2['default'])(patcher.original, node.range[0]));
        patcher.overwrite(target.left.range[0], target.left.range[1], startBinding);
        rewritten = true;
      }
      if (!(0, _utilsIsSafeToRepeat2['default'])(target.right)) {
        var endBinding = (0, _utilsGetFreeBinding2['default'])(scope, 'end');
        patcher.insert(node.range[0], endBinding + ' = ' + target.right.raw + '\n' + (0, _utilsGetIndent2['default'])(patcher.original, node.range[0]));
        patcher.overwrite(target.right.range[0], target.right.range[1], endBinding);
        rewritten = true;
      }
    } else if (!(0, _utilsIsSafeToRepeat2['default'])(target)) {
      var iterableBinding = (0, _utilsGetFreeBinding2['default'])(scope, 'iterable');
      patcher.insert(node.range[0], iterableBinding + ' = ' + target.raw + '\n' + (0, _utilsGetIndent2['default'])(patcher.original, node.range[0]));
      patcher.overwrite(target.range[0], target.range[1], iterableBinding);
      rewritten = true;
    }

    return rewritten;
  }
}

/**
 * Turn for-of loops with a value assignee into one with just a key assignee by
 * moving the value assignment into the loop body.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */
function moveValueAssignmentIntoBody(node, patcher) {
  var keyAssignee = node.keyAssignee;
  var valAssignee = node.valAssignee;
  var scope = node.scope;

  if (node.type === 'ForOf') {
    if (valAssignee) {
      // e.g. `for k, v of o` -> `for k of o` and `v = o[k]`
      var iterable = extractIterableIfNeeded(node, patcher);
      var assignments = [];
      var key = keyAssignee.raw;

      if (keyAssignee.type !== 'Identifier') {
        // destructured key, use a temporary variable for the key
        key = (0, _utilsGetFreeBinding2['default'])(scope, 'key');
        patcher.overwrite(keyAssignee.range[0], keyAssignee.range[1], key);
        assignments.push(keyAssignee.raw + ' = ' + key);
      }

      // e.g. `for k, v of o` -> `for k in o`
      //            ^^^
      patcher.remove(keyAssignee.range[1], valAssignee.range[1]);
      assignments.push(valAssignee.raw + ' = ' + iterable + '[' + key + ']');
      (0, _utilsPrependLinesToBlock2['default'])(patcher, assignments, node.body);
      return true;
    }
  }
}

/**
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {string}
 */
function extractIterableIfNeeded(node, patcher) {
  var scope = node.scope;
  var target = node.target;

  var canRepeatIterable = (0, _utilsIsSafeToRepeat2['default'])(target);
  var iterable = canRepeatIterable ? target.raw : (0, _utilsGetFreeBinding2['default'])(scope, 'iterable');

  if (!canRepeatIterable) {
    patcher.overwrite(target.range[0], target.range[1], '(' + iterable + ' = ' + target.raw + ')');
  }

  return iterable;
}

/**
 * If the `for` loop contains a `when` clause we turn it into an `if` in the
 * body of the `for` loop.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */
function convertFilterIntoBodyConditional(node, patcher) {
  if (!node.filter) {
    return false;
  }

  var indent = (0, _utilsGetIndent2['default'])(patcher.original, node.body.range[0]);
  patcher.insert(node.body.range[0], 'if ' + node.filter.raw + '\n' + indent);
  patcher.remove(node.filter.range[0] - ' when '.length, node.filter.range[1]);
  (0, _utilsIndentNode2['default'])(node.body, patcher);
  return true;
}

/**
 * Converts a `for` loop with the `own` flag to one without the `own` flag whose
 * body is wrapped in a conditional checking that the key is an own property.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */
function convertForOwnIntoBodyConditional(node, patcher) {
  if (!node.isOwn) {
    return false;
  }

  var iterable = extractIterableIfNeeded(node, patcher);
  var indent = (0, _utilsGetIndent2['default'])(patcher.original, node.body.range[0]);
  patcher.insert(node.body.range[0], 'if Object::hasOwnProperty.call(' + iterable + ', ' + node.keyAssignee.raw + ')\n' + indent);
  patcher.remove(node.range[0] + 'for '.length, node.range[0] + 'for own '.length);
  (0, _utilsIndentNode2['default'])(node.body, patcher);
  return true;
}
module.exports = exports['default'];