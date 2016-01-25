'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessSoakedMemberAccessOp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

/**
 * Re-writes soaked member expressions into CoffeeScript that does not use
 * soaked member expressions.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessSoakedMemberAccessOp(node, patcher) {
  if (node.type === 'SoakedMemberAccessOp' || node.type === 'SoakedDynamicMemberAccessOp') {
    // For member access with identifier object:
    //
    // `a?.b()` -> `if a? then a.b()`
    //              ^^^  ^^^^^^^
    //
    // For member access with complex object:
    //
    // `a.b?.c` -> `if (ref = a.b)? then ref.c`
    //              ^^^^^^^^^^   ^ ^^^^^^^^^
    var expression = node.expression;
    var conditional = undefined;
    if (node.parentNode.type === 'FunctionApplication' && node.parentNode['function'] === node) {
      conditional = node.parentNode;
    } else {
      conditional = node;
    }
    var parens = conditional.parentNode.type !== 'Block';
    var consequent = undefined;
    if (parens) {
      patcher.insert(conditional.range[0], '(');
    }
    patcher.insert(expression.range[0], 'if ');
    if (expression.type === 'Identifier') {
      consequent = ' then ' + expression.raw;
    } else {
      var tmp = (0, _utilsGetFreeBinding2['default'])(node.scope);
      patcher.insert(expression.range[0], '(' + tmp + ' = ');
      patcher.insert(expression.range[1], ')');
      consequent = ' then ' + tmp;
    }
    patcher.insert(expression.range[1] + 1, consequent);
    if (parens) {
      patcher.insert(conditional.range[1], ')');
    }
    return true;
  }
}

module.exports = exports['default'];