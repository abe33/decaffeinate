'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessSwitch;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsDetermineIndent = require('../utils/determineIndent');

var _utilsDetermineIndent2 = _interopRequireDefault(_utilsDetermineIndent);

var _utilsGetIndent = require('../utils/getIndent');

var _utilsGetIndent2 = _interopRequireDefault(_utilsGetIndent);

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

/**
 * Converts `switch` used as an expression to `switch` inside an IIFE.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function preprocessSwitch(node, patcher) {
  if (node.type === 'Switch' && (0, _utilsIsExpressionResultUsed2['default'])(node)) {
    var source = patcher.original;
    var indent = (0, _utilsDetermineIndent2['default'])(source);
    patcher.insert(node.range[0], 'do ->\n' + ((0, _utilsGetIndent2['default'])(source, node.range[0]) + indent));

    var index = source.indexOf('\n', node.range[0]);

    while (0 <= index && index < node.range[1]) {
      patcher.insert(index + '\n'.length, indent);
      index = source.indexOf('\n', index + '\n'.length);
    }

    return true;
  }
}

module.exports = exports['default'];