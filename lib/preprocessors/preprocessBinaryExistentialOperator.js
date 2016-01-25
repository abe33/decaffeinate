'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessBinaryExistentialOperator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

/**
 * Convert binary existential operators, e.g. `a ? b` into `if` expressions
 * using unary existential operators, e.g. `if a? then a else b`.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function preprocessBinaryExistentialOperator(node, patcher) {
  if (node.type === 'ExistsOp') {
    // e.g. `if a? then a else b`
    //       ^^^
    patcher.insert(node.range[0], 'if ');

    if (node.left.type === 'Identifier') {
      // e.g. `a ? b` -> `if a? then a else b`
      //       ^^^^^         ^^^^^^^^^^^^^^^^
      patcher.overwrite(node.range[0], node.range[1], node.left.raw + '? then ' + node.left.raw + ' else ' + node.right.raw);
    } else {
      var tmp = (0, _utilsGetFreeBinding2['default'])(node.scope);
      // e.g. `@a ? @b` -> `if (ref = @a)? then ref else @b`
      //       ^^^^^^^         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      patcher.overwrite(node.range[0], node.range[1], '(' + tmp + ' = ' + node.left.raw + ')? then ' + tmp + ' else ' + node.right.raw);
    }

    return true;
  }
}

module.exports = exports['default'];