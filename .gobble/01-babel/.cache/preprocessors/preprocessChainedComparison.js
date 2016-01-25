'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessChainedComparison;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsIsSafeToRepeat = require('../utils/isSafeToRepeat');

var _utilsIsSafeToRepeat2 = _interopRequireDefault(_utilsIsSafeToRepeat);

/**
 * Expands chained comparisons, i.e. `a < b < c` to `a < b && b < c`.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function preprocessChainedComparison(node, patcher) {
  if (node.type === 'ChainedComparisonOp') {
    var middle = node.expression.left.right;
    if ((0, _utilsIsSafeToRepeat2['default'])(middle)) {
      patcher.insert(middle.range[1], ' && ' + middle.raw);
    } else {
      var temp = (0, _utilsGetFreeBinding2['default'])(node.scope);
      patcher.overwrite(middle.range[0], middle.range[1], '(' + temp + ' = ' + middle.raw + ') && ' + temp);
    }
    return true;
  }
}

module.exports = exports['default'];