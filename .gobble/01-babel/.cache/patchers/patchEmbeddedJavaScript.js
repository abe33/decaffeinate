/**
 * Removes the backticks surrounding embedded JavaScript.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchEmbeddedJavaScript;

function patchEmbeddedJavaScript(node, patcher) {
  if (node.type === 'JavaScript') {
    patcher.overwrite(node.range[0], node.range[0] + 1, '');
    patcher.overwrite(node.range[1] - 1, node.range[1], '');
  }
}

module.exports = exports['default'];