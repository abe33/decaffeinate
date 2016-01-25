/**
 * Patches rest parameters.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchRestStart = patchRestStart;
exports.patchRestEnd = patchRestEnd;

function patchRestStart(node, patcher) {
  if (node.type === 'Rest') {
    patcher.insert(node.range[0], '...');
  }
}

/**
 * Patches rest parameters.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchRestEnd(node, patcher) {
  if (node.type === 'Rest') {
    patcher.overwrite(node.range[1] - '...'.length, node.range[1], '');
  }
}