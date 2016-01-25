'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessDo;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

/**
 * Preprocesses `do` expressions by turning them into IIFEs.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function preprocessDo(node, patcher) {
  if (node.type === 'DoOp') {
    var expression = node.expression;
    var parameters = expression.parameters;

    var trimmedRange = (0, _utilsTrimmedNodeRange2['default'])(node, patcher.original);

    // Remove initializers from default params.
    parameters.forEach(function (param) {
      if (param.type === 'DefaultParam') {
        patcher.remove(param.param.range[1], param['default'].range[1]);
      }
    });

    // Collect the arguments that should be used for the IIFE call.
    var args = parameters.map(argumentForDoParameter);
    patcher.overwrite(trimmedRange[0], expression.range[0], '(');
    patcher.overwrite(trimmedRange[1], trimmedRange[1], ')(' + args.join(', ') + ')');
    return true;
  }
}

function argumentForDoParameter(node) {
  switch (node.type) {
    case 'DefaultParam':
      return node['default'].raw;

    default:
      return node.raw;
  }
}
module.exports = exports['default'];