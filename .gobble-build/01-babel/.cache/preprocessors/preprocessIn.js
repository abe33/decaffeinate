'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessIn;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var _utilsRequiresParentheses = require('../utils/requiresParentheses');

var _utilsRequiresParentheses2 = _interopRequireDefault(_utilsRequiresParentheses);

/**
 * Replace `in` infix operators with a call to `indexOf`.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessIn(node, patcher) {
  if (node.type === 'InOp') {
    var indexable = node.right.raw;
    var element = node.left.raw;
    var needsParentheses = false;
    var prefix = '';

    if (node.left.type !== 'Identifier') {
      var temp = (0, _utilsGetFreeBinding2['default'])(node.scope);
      needsParentheses = (0, _utilsIsExpressionResultUsed2['default'])(node);
      prefix += temp + ' = ' + element + '; ';
      element = temp;
    }

    if ((0, _utilsRequiresParentheses2['default'])(node.right)) {
      indexable = '(' + indexable + ')';
    }

    var isNegated = patcher.original.slice(node.left.range[1], node.right.range[0]).indexOf('not in') >= 0;
    var replacement = '' + prefix + indexable + '.indexOf(' + element + ') ' + (isNegated ? '<' : '>=') + ' 0';

    if (needsParentheses) {
      replacement = '(' + replacement + ')';
    }

    patcher.overwrite(node.range[0], node.range[1], replacement);
    return true;
  }
}

module.exports = exports['default'];