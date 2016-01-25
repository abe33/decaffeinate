/**
 * Patches sequences by replacing the character used to align with JavaScript.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchSequences;

function patchSequences(node, patcher) {
  if (node.type === 'SeqOp') {
    var sourceBetween = patcher.slice(node.left.range[1], node.right.range[0]);
    var sequenceCharacterIndex = sourceBetween.indexOf(';');
    patcher.overwrite(node.left.range[1] + sequenceCharacterIndex, node.left.range[1] + sequenceCharacterIndex + ';'.length, ',');
  }
}

module.exports = exports['default'];