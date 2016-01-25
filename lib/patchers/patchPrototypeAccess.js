/**
 * Replaces shorthand `::` with longhand prototype access.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchPrototypeAccess;

function patchPrototypeAccess(node, patcher) {
  if (node.type === 'ProtoMemberAccessOp') {
    var opStart = node.expression.range[1];
    patcher.overwrite(opStart, opStart + '::'.length, '.prototype.');
  }
}

module.exports = exports['default'];