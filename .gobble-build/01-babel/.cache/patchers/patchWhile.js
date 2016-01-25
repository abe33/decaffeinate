'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchWhileStart = patchWhileStart;
exports.patchWhileEnd = patchWhileEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAppendClosingBrace = require('../utils/appendClosingBrace');

var _utilsAppendClosingBrace2 = _interopRequireDefault(_utilsAppendClosingBrace);

var _utilsIsSurroundedBy = require('../utils/isSurroundedBy');

var _utilsIsSurroundedBy2 = _interopRequireDefault(_utilsIsSurroundedBy);

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchWhileStart(node, patcher) {
  if (isWhileCondition(node)) {
    if (!(0, _utilsIsSurroundedBy2['default'])(node, '(', patcher.original)) {
      patcher.insert(node.range[0], '(');
    }
  }
}

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchWhileEnd(node, patcher) {
  if (isWhileCondition(node)) {
    if ((0, _utilsIsSurroundedBy2['default'])(node, '(', patcher.original)) {
      patcher.insert(node.range[1] + ')'.length, ' {');
    } else {
      patcher.insert(node.range[1], ') {');
    }
  } else if (node.type === 'While') {
    (0, _utilsAppendClosingBrace2['default'])(node, patcher);
  }
}

/**
 * @param {Object} node
 * @returns {boolean}
 */
function isWhileCondition(node) {
  var parentNode = node.parentNode;

  if (!parentNode) {
    return false;
  } else if (parentNode.type !== 'While') {
    return false;
  } else {
    return parentNode.condition === node;
  }
}