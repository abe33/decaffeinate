'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessClass;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _utilsConvertBoundFunctionToUnboundFunction = require('../utils/convertBoundFunctionToUnboundFunction');

var _utilsConvertBoundFunctionToUnboundFunction2 = _interopRequireDefault(_utilsConvertBoundFunctionToUnboundFunction);

var _utilsDetermineIndent = require('../utils/determineIndent');

var _utilsDetermineIndent2 = _interopRequireDefault(_utilsDetermineIndent);

var _utilsPrependLinesToBlock = require('../utils/prependLinesToBlock');

var _utilsPrependLinesToBlock2 = _interopRequireDefault(_utilsPrependLinesToBlock);

function preprocessClass(node, patcher) {
  if (node.type === 'Class') {
    var _ret = (function () {
      var bindings = [];

      if (node.boundMembers.length > 0) {
        var _ret2 = (function () {
          var indent = (0, _utilsDetermineIndent2['default'])(patcher.original);

          node.body.statements.forEach(function (statement) {
            if (statement.type === 'ClassProtoAssignOp' && statement.expression.type === 'BoundFunction') {
              var assignee = statement.assignee;
              var expression = statement.expression;

              bindings.push('this.' + assignee.data + ' = this.' + assignee.data + '.bind(this)');
              (0, _utilsConvertBoundFunctionToUnboundFunction2['default'])(expression, patcher);
            }
          });

          if (node.ctor) {
            (0, _utilsPrependLinesToBlock2['default'])(patcher, bindings, node.ctor.expression.body);
          } else {
            var _constructor = ['constructor: ->'];
            if (node.parent) {
              // FIXME: CSR does not actually support `super` yet!
              _constructor.push(indent + 'super()');
            }
            _constructor.push.apply(_constructor, _toConsumableArray(bindings.map(function (binding) {
              return indent + binding;
            })).concat(['']));
            (0, _utilsPrependLinesToBlock2['default'])(patcher, _constructor, node.body);
          }

          return {
            v: {
              v: true
            }
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      }
    })();

    if (typeof _ret === 'object') return _ret.v;
  }
}

module.exports = exports['default'];