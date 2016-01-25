/**
 * Replaces block regexes with single-line regexes.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchRegularExpressions;

function patchRegularExpressions(node, patcher) {
  if (node.type === 'RegExp') {
    patcher.overwrite(node.range[0], node.range[1], '/' + node.data + '/' + flagStringForRegularExpressionNode(node));
  }
}

/**
 * @param {Object} node
 * @returns {string}
 * @private
 */
function flagStringForRegularExpressionNode(node) {
  var flags = '';
  if (node.flags.i) {
    flags += 'i';
  }
  if (node.flags.g) {
    flags += 'g';
  }
  if (node.flags.m) {
    flags += 'm';
  }
  if (node.flags.y) {
    flags += 'y';
  }
  return flags;
}
module.exports = exports['default'];