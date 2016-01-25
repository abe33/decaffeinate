/**
 * Patches spread arguments.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchSpreadStart = patchSpreadStart;
exports.patchSpreadEnd = patchSpreadEnd;

function patchSpreadStart(node, patcher) {
  if (node.type === 'Spread') {
    patcher.insert(node.range[0], '...');
  }
}

/**
 * Patches spread arguments.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchSpreadEnd(node, patcher) {
  if (node.type === 'Spread') {
    patcher.overwrite(node.range[1] - '...'.length, node.range[1], '');
  }
}