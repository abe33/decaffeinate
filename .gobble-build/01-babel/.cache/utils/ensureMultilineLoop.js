'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ensureMultilineLoop;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAdjustIndent = require('../utils/adjustIndent');

var _utilsAdjustIndent2 = _interopRequireDefault(_utilsAdjustIndent);

/**
 * Re-order `for` loop parts if the body precedes the rest.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function ensureMultilineLoop(node, patcher) {
  var keyAssignee = node.keyAssignee;
  var valAssignee = node.valAssignee;
  var body = node.body;

  var firstAssignee = null;
  var keyword = null;

  switch (node.type) {
    case 'ForOf':
      firstAssignee = keyAssignee;
      keyword = node.isOwn ? 'for own' : 'for';
      break;

    case 'ForIn':
      firstAssignee = valAssignee;
      keyword = 'for';
      break;

    case 'While':
      firstAssignee = node.condition;
      keyword = 'while';
      break;
  }

  if (!firstAssignee) {
    return false;
  }

  if (body.range[0] >= firstAssignee.range[0]) {
    return false;
  }

  // e.g. `k for k of o` -> `for k of o\n  k`
  patcher.remove(body.range[0], firstAssignee.range[0] - (keyword + ' ').length);
  patcher.insert(node.range[1], '\n' + (0, _utilsAdjustIndent2['default'])(patcher.original, node.range[0], 1) + body.raw);
  return true;
}

module.exports = exports['default'];