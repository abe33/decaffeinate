'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessTry;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsGetIndent = require('../utils/getIndent');

var _utilsGetIndent2 = _interopRequireDefault(_utilsGetIndent);

var _utilsIndexOfIgnoringComments = require('../utils/indexOfIgnoringComments');

var _utilsIndexOfIgnoringComments2 = _interopRequireDefault(_utilsIndexOfIgnoringComments);

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var _utilsIsMultiline = require('../utils/isMultiline');

var _utilsIsMultiline2 = _interopRequireDefault(_utilsIsMultiline);

var _utilsMakeIIFE = require('../utils/makeIIFE');

var _utilsMakeIIFE2 = _interopRequireDefault(_utilsMakeIIFE);

var _utilsSourceBetween = require('../utils/sourceBetween');

var _utilsSourceBetween2 = _interopRequireDefault(_utilsSourceBetween);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

/**
 * Rewrites `try` expressions by wrapping them in an IIFE. Ensures catch
 * exists with an error assignee if needed.
 *
 * @example
 *
 *   (try a)(b) # => (=> try a catch error)(b)
 *
 *   try
 *     a
 *   catch # => catch error
 *     b
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessTry(node, patcher) {
  if (node.type === 'Try') {
    if ((0, _utilsIsExpressionResultUsed2['default'])(node)) {
      (0, _utilsMakeIIFE2['default'])(node, patcher);
      return true;
    }

    if (!node.catchAssignee) {
      if (node.catchBody) {
        var nodeBeforeCatchClause = node.body;
        var nodeAfterCatchClause = node.catchBody;
        var source = (0, _utilsSourceBetween2['default'])(patcher.original, nodeBeforeCatchClause, nodeAfterCatchClause);
        var catchIndex = (0, _utilsIndexOfIgnoringComments2['default'])(source, 'catch');
        if (catchIndex === -1) {
          throw new Error('unable to find catch between try block body ' + ('(' + nodeBeforeCatchClause.line + ':' + nodeBeforeCatchClause.column + ') and catch body ') + ('(' + nodeAfterCatchClause.line + ':' + nodeAfterCatchClause.column + ')'));
        }
        patcher.insert(nodeBeforeCatchClause.range[1] + catchIndex + 'catch'.length, ' ' + (0, _utilsGetFreeBinding2['default'])(node.scope, 'error'));
        return true;
      } else if (!node.finallyBody) {
        if (node.body.type === 'Block') {
          patcher.insert((0, _utilsTrimmedNodeRange2['default'])(node.body, patcher.original)[1], '\n' + (0, _utilsGetIndent2['default'])(patcher.original, node.range[0]) + 'catch ' + (0, _utilsGetFreeBinding2['default'])(node.scope, 'error'));
          return true;
        } else if (!(0, _utilsIsMultiline2['default'])(patcher.original, node)) {
          patcher.insert((0, _utilsTrimmedNodeRange2['default'])(node, patcher.original)[1], ' catch ' + (0, _utilsGetFreeBinding2['default'])(node.scope, 'error'));
          return true;
        }
      }
    }
  }
}

module.exports = exports['default'];