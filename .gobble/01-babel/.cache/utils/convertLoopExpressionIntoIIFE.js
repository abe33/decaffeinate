'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = convertLoopExpressionIntoIIFE;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAdjustIndent = require('../utils/adjustIndent');

var _utilsAdjustIndent2 = _interopRequireDefault(_utilsAdjustIndent);

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsGetIndent = require('../utils/getIndent');

var _utilsGetIndent2 = _interopRequireDefault(_utilsGetIndent);

var _utilsIndentNode = require('../utils/indentNode');

var _utilsIndentNode2 = _interopRequireDefault(_utilsIndentNode);

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

/**
 * If the `for` loop is used as an expression we wrap it in an IIFE.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function convertLoopExpressionIntoIIFE(node, patcher) {
  if (!(0, _utilsIsExpressionResultUsed2['default'])(node)) {
    return false;
  }

  var result = (0, _utilsGetFreeBinding2['default'])(node.scope, 'result');

  var thisIndent = (0, _utilsGetIndent2['default'])(patcher.original, node.range[0]);
  var nextIndent = (0, _utilsAdjustIndent2['default'])(patcher.original, node.range[0], 1);
  patcher.insert(node.range[0], 'do =>\n' + nextIndent + result + ' = []\n' + thisIndent);
  (0, _utilsIndentNode2['default'])(node, patcher);
  var lastStatement = node.body.statements[node.body.statements.length - 1];
  var lastStatementRange = (0, _utilsTrimmedNodeRange2['default'])(lastStatement, patcher.original);
  patcher.insert(lastStatementRange[0], result + '.push(');
  patcher.insert(lastStatementRange[1], ')');
  patcher.insert((0, _utilsTrimmedNodeRange2['default'])(node, patcher.original)[1], '\n' + nextIndent + result);

  return true;
}

module.exports = exports['default'];