'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchTryStart = patchTryStart;
exports.patchTryEnd = patchTryEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAppendClosingBrace = require('../utils/appendClosingBrace');

var _utilsAppendClosingBrace2 = _interopRequireDefault(_utilsAppendClosingBrace);

var _utilsLastIndexOfIgnoringComments = require('../utils/lastIndexOfIgnoringComments');

var _utilsLastIndexOfIgnoringComments2 = _interopRequireDefault(_utilsLastIndexOfIgnoringComments);

/**
 * Adds punctuation to `try` statements.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchTryStart(node, patcher) {
  if (node.type === 'Try') {
    patcher.insert(node.range[0] + 'try'.length, ' {');
  } else if (node.parentNode && node.parentNode.type === 'Try') {
    if (node.parentNode.catchAssignee === node) {
      patcher.insert(node.range[0], '(');
      patcher.insert(node.range[1], ') {');
    } else if (node.parentNode.finallyBody === node) {
      var finallyIndex = (0, _utilsLastIndexOfIgnoringComments2['default'])(patcher.original, 'finally', node.parentNode.finallyBody.range[0] - 1);
      patcher.insert(finallyIndex + 'finally'.length, ' {');
    }
  }
}

/**
 * Adds punctuation to `try` statements.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchTryEnd(node, patcher) {
  if (node.type === 'Try') {
    (0, _utilsAppendClosingBrace2['default'])(node, patcher);
  } else if (node.parentNode && node.parentNode.type === 'Try') {
    if (node.parentNode.body === node) {
      var closeBraceIndex = undefined;
      var source = patcher.original;
      if (node.parentNode.catchAssignee) {
        closeBraceIndex = (0, _utilsLastIndexOfIgnoringComments2['default'])(source, 'catch', node.parentNode.catchAssignee.range[0] - 1);
      } else {
        closeBraceIndex = (0, _utilsLastIndexOfIgnoringComments2['default'])(source, 'finally', node.parentNode.finallyBody.range[0] - 1);
      }
      patcher.insert(closeBraceIndex, '} ');
    }
  }
}