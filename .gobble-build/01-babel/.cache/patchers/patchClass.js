'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchClassStart = patchClassStart;
exports.patchClassEnd = patchClassEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAppendClosingBrace = require('../utils/appendClosingBrace');

var _utilsAppendClosingBrace2 = _interopRequireDefault(_utilsAppendClosingBrace);

var _utilsIsSurroundedBy = require('../utils/isSurroundedBy');

var _utilsIsSurroundedBy2 = _interopRequireDefault(_utilsIsSurroundedBy);

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

/**
 * Patches the start of class-related nodes.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchClassStart(node, patcher) {
  var parentNode = node.parentNode;

  if (node.type === 'Class') {
    if (node.body) {
      var braceIndex = undefined;
      var superclass = node.parent;

      if (superclass) {
        braceIndex = superclass.range[1];
        if ((0, _utilsIsSurroundedBy2['default'])(superclass, '(', patcher.original)) {
          braceIndex += '('.length;
        }
      } else {
        braceIndex = node.nameAssignee.range[1];
      }

      patcher.insert(braceIndex, ' {');
    }
  } else if (isClassProtoAssignExpression(node)) {
    if (!(0, _utilsReplaceBetween2['default'])(patcher, parentNode.assignee, node, ' : ', ' = ')) {
      if (!(0, _utilsReplaceBetween2['default'])(patcher, parentNode.assignee, node, ': ', ' = ')) {
        (0, _utilsReplaceBetween2['default'])(patcher, parentNode.assignee, node, ':', ' = ');
      }
    }
  }
}

/**
 * Patches the end of class-related nodes.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchClassEnd(node, patcher) {
  if (node.type === 'Class') {
    if (node.body) {
      (0, _utilsAppendClosingBrace2['default'])(node, patcher);
    } else {
      if (!node.nameAssignee) {
        patcher.insert(node.range[0], '(');
        patcher.insert(node.range[1], ' {})');
      } else {
        patcher.insert(node.range[1], ' {}');
      }
    }
  } else if (isClassProtoAssignExpression(node)) {
    patcher.insert(node.range[1], ';');
  }
}

/**
 * @param {Object} node
 * @returns {boolean}
 */
function isClassProtoAssignExpression(node) {
  var parentNode = node.parentNode;

  return parentNode && parentNode.type === 'ClassProtoAssignOp' && node === parentNode.expression && node.type !== 'Function';
}