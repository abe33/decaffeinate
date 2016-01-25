'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessConditional;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsMakeIIFE = require('../utils/makeIIFE');

var _utilsMakeIIFE2 = _interopRequireDefault(_utilsMakeIIFE);

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var _utilsIsMultiline = require('../utils/isMultiline');

var _utilsIsMultiline2 = _interopRequireDefault(_utilsIsMultiline);

var _utilsSourceBetween = require('../utils/sourceBetween');

var _utilsSourceBetween2 = _interopRequireDefault(_utilsSourceBetween);

/**
 * Rewrites POST `if` and `unless` conditionals to be PRE conditionals. Returns
 * whether or not any rewrites happened for the given node.
 *
 * @example
 *
 *   a if b  # => if b then a
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessConditional(node, patcher) {
  if (node.type === 'Conditional') {
    var condition = node.condition;
    var consequent = node.consequent;
    if (condition.range[0] > consequent.range[0]) {
      // Found a POST-if/unless, transform it.
      var ifOrUnlessToken = (0, _utilsSourceBetween2['default'])(patcher.original, consequent, condition).trim();
      patcher.overwrite(node.range[0], node.range[1], ifOrUnlessToken + ' ' + condition.raw.trim() + ' then ' + consequent.raw.trim());
      return true;
    } else if ((0, _utilsIsExpressionResultUsed2['default'])(node) && (0, _utilsIsMultiline2['default'])(patcher.original, node)) {
      (0, _utilsMakeIIFE2['default'])(node, patcher);
      return true;
    }
  }
}

module.exports = exports['default'];