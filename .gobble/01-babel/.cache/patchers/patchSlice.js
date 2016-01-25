'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchSliceStart = patchSliceStart;
exports.patchSliceEnd = patchSliceEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

var _assert = require('assert');

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchSliceStart(node, patcher) {
  var parentNode = node.parentNode;

  if (parentNode && parentNode.type === 'Slice') {
    if (parentNode.left === node) {
      (0, _utilsReplaceBetween2['default'])(patcher, parentNode.expression, node, '[', '.slice(');
    } else if (parentNode.right === node) {
      (0, _utilsReplaceBetween2['default'])(patcher, parentNode.left, node, parentNode.isInclusive ? '..' : '...', ', ');

      if (parentNode.isInclusive) {
        if (node.type === 'Int') {
          patcher.overwrite(node.range[0], node.range[1], '' + (node.data + 1));
        } else {
          patcher.insert(node.range[1], ' + 1');
        }
      }
    }
  }
}

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchSliceEnd(node, patcher) {
  var parentNode = node.parentNode;

  if (parentNode && parentNode.type === 'Slice') {
    if (parentNode.left === node) {
      if (!parentNode.right) {
        patcher.overwrite(node.range[1], parentNode.range[1], ')');
      }
    } else if (parentNode.right === node) {
      (0, _assert.strictEqual)(patcher.original[parentNode.range[1] - 1], ']', 'last character of Slice node must be "]"');
      patcher.overwrite(parentNode.range[1] - 1, parentNode.range[1], ')');
    } else if (parentNode.expression === node && !parentNode.left && !parentNode.right) {
      patcher.overwrite(node.range[1], parentNode.range[1], '.slice()');
    }
  }
}