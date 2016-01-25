'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchCommas;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsStripComments = require('../utils/stripComments');

var _utilsStripComments2 = _interopRequireDefault(_utilsStripComments);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

/**
 * Inserts missing commas in objects, arrays, and calls.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchCommas(node, patcher) {
  switch (node.parentNode && node.parentNode.type) {
    case 'ObjectInitialiser':
    case 'ArrayInitialiser':
      patchCommaAfterNode(node, node.parentNode.members, patcher);
      break;

    case 'FunctionApplication':
      if (node.parentNode.arguments.indexOf(node) >= 0) {
        patchCommaAfterNode(node, node.parentNode.arguments, patcher);
      }
      break;
  }
}

/**
 * Inserts missing commas between member and its next sibling.
 *
 * @param {Object} member
 * @param {Object[]} members
 * @param {MagicString} patcher
 */
function patchCommaAfterNode(member, members, patcher) {
  var memberIndex = members.indexOf(member);
  var nextMember = members[memberIndex + 1];

  if (!nextMember) {
    return;
  }

  var nodeRange = (0, _utilsTrimmedNodeRange2['default'])(member, patcher.original);
  var sourceBetween = (0, _utilsStripComments2['default'])(patcher.original.slice(member.range[1], nextMember.range[0]));
  if (sourceBetween.indexOf(',') < 0) {
    patcher.insert(nodeRange[1], ',');
  }
}
module.exports = exports['default'];