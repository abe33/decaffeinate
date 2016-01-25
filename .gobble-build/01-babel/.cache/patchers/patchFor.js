'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchForStart = patchForStart;
exports.patchForEnd = patchForEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAppendClosingBrace = require('../utils/appendClosingBrace');

var _utilsAppendClosingBrace2 = _interopRequireDefault(_utilsAppendClosingBrace);

var _utilsPrependLinesToBlock = require('../utils/prependLinesToBlock');

var _utilsPrependLinesToBlock2 = _interopRequireDefault(_utilsPrependLinesToBlock);

var _utilsRangeIncludingParentheses = require('../utils/rangeIncludingParentheses');

var _utilsRangeIncludingParentheses2 = _interopRequireDefault(_utilsRangeIncludingParentheses);

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchForStart(node, patcher) {
  var parentNode = node.parentNode;

  if (node.type === 'ForIn') {
    patcher.overwrite(node.range[0] + 'for '.length, (node.step.range || node.target.range)[1], '(' + loopHeader(node) + ') {');
  } else if (node.type === 'ForOf') {
    // e.g. `for key of object` -> `for (var key in object)`
    //                                  ^^^^^
    patcher.insert(node.range[0] + 'for '.length, '(var ');
  } else if (parentNode && parentNode.type === 'ForOf' && node === parentNode.target) {
    // e.g. `for key of object` -> `for (var key in object)`
    //              ^^^^                        ^^^^
    (0, _utilsReplaceBetween2['default'])(patcher, parentNode.keyAssignee, node, ' of ', ' in ');
  }
}

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchForEnd(node, patcher) {
  var parentNode = node.parentNode;

  if (isForLoopTarget(node)) {
    if (parentNode.type === 'ForIn' && node.type !== 'Range') {
      (0, _utilsPrependLinesToBlock2['default'])(patcher, [parentNode.valAssignee.raw + ' = ' + node.raw + '[' + parentNode.keyAssignee.raw + '];'], parentNode.body);
    } else if (parentNode.type === 'ForOf') {
      // e.g. `for key of object` -> `for (var key in object) {`
      //                                                    ^^^
      patcher.insert((0, _utilsRangeIncludingParentheses2['default'])(node, patcher.original)[1], ') {');
    }
  }

  if (node.type === 'ForOf' || node.type === 'ForIn') {
    (0, _utilsAppendClosingBrace2['default'])(node, patcher);
  }
}

/**
 * Determines whether the given node is the target of a `for` loop.
 *
 * @param {Object} node ForOf|ForIn
 * @returns {boolean}
 */
function isForLoopTarget(node) {
  var parentNode = node.parentNode;

  if (!parentNode) {
    return false;
  }

  switch (parentNode.type) {
    case 'ForOf':
    case 'ForIn':
      return node === parentNode.target;

    default:
      return false;
  }
}

/**
 * Generates the init, test, and update components for a JavaScript `for` loop.
 *
 * @param {Object} node ForIn
 * @returns {string}
 */
function loopHeader(node) {
  var valAssignee = node.valAssignee;
  var target = node.target;

  if (target.type === 'Range') {
    // i.e. `for i in [a..b]`
    var left = target.left;
    var right = target.right;
    var isInclusive = target.isInclusive;

    var counter = valAssignee.raw;
    var result = 'var ' + counter + ' = ' + left.raw + '; ';
    if (left.type === 'Int' && right.type === 'Int') {
      // i.e. `for i in [0..10]`
      if (left.data < right.data) {
        result += counter + ' ' + (isInclusive ? '<=' : '<') + ' ' + right.raw + '; ' + loopUpdate(node, counter);
      } else {
        result += counter + ' ' + (isInclusive ? '>=' : '>') + ' ' + right.raw + '; ' + loopUpdate(node, counter, true);
      }
    } else {
      // i.e. `for i in [a..b]`
      result += left.raw + ' < ' + right.raw + ' ? ' + counter + ' ' + (isInclusive ? '<=' : '<') + ' ' + right.raw + ' : ' + counter + ' ' + (isInclusive ? '>=' : '>') + ' ' + right.raw + '; ';
      result += left.raw + ' < ' + right.raw + ' ? ' + loopUpdate(node, counter) + ' : ' + loopUpdate(node, counter, true);
    }

    return result;
  } else {
    // i.e. `for element in list`
    var valueBinding = valAssignee.raw;
    var counter = node.keyAssignee.raw;
    var result = 'var ' + counter + ' = ';
    if (loopStepCount(node) > 0) {
      result += '0, ' + valueBinding + '; ' + counter + ' < ' + target.raw + '.length; ' + loopUpdate(node, counter);
    } else {
      result += target.raw + '.length - 1, ' + valueBinding + '; ' + counter + ' >= 0; ' + loopUpdate(node, counter, true);
    }
    return result;
  }
}

/**
 * Generates an update expression of a JavaScript `for` loop.
 *
 * @param {Object} node
 * @param {string} counter
 * @param {boolean} descending
 * @returns {string}
 */
function loopUpdate(node, counter) {
  var descending = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var hasExplicitStep = !!node.step.range;
  var stepCount = loopStepCount(node);

  if (descending && !hasExplicitStep) {
    stepCount = -stepCount;
  }

  if (stepCount === 1) {
    return counter + '++';
  }

  if (stepCount === -1) {
    return counter + '--';
  }

  if (stepCount > 0) {
    return counter + ' += ' + stepCount;
  }

  return counter + ' -= ' + -stepCount;
}

/**
 * Determines the step count of a for-in loop, e.g. `for a in b by 2` returns 2.
 *
 * @param {Object} node ForIn
 * @returns {number}
 */
function loopStepCount(node) {
  if (node.step.type === 'UnaryNegateOp') {
    return -node.step.expression.data;
  } else {
    return node.step.data;
  }
}