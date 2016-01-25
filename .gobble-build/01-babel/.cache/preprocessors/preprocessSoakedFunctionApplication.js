'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessSoakedFunctionApplication;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsIsSafeToRepeat = require('../utils/isSafeToRepeat');

var _utilsIsSafeToRepeat2 = _interopRequireDefault(_utilsIsSafeToRepeat);

function preprocessSoakedFunctionApplication(node, patcher) {
  if (node.type === 'SoakedFunctionApplication') {
    var args = patcher.original.slice(node['function'].range[1] + '?'.length, node.range[1]);
    var typeofArgument = undefined;
    var fn = undefined;

    if ((0, _utilsIsSafeToRepeat2['default'])(node['function'])) {
      // `a?()` -> `if typeof a == "function" then a()`
      typeofArgument = node['function'].raw;
      fn = node['function'].raw;
    } else {
      // `a(1)?()` -> `if typeof (fn = a(1)) == "function" then fn()`
      fn = (0, _utilsGetFreeBinding2['default'])(node.scope, 'fn');
      typeofArgument = '(' + fn + ' = ' + node['function'].raw + ')';
    }

    patcher.overwrite(node.range[0], node.range[1], 'if typeof ' + typeofArgument + ' == "function" then ' + fn + args);

    return true;
  }
}

module.exports = exports['default'];