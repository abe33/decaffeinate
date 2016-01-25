'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessCompoundAssignment;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsIsSafeToRepeat = require('../utils/isSafeToRepeat');

var _utilsIsSafeToRepeat2 = _interopRequireDefault(_utilsIsSafeToRepeat);

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

/**
 * Convert special compound assigns that are not direct passthroughs to
 * JavaScript such as `a ||= b`.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @returns {boolean}
 */

function preprocessCompoundAssignment(node, patcher) {
  if (node.type === 'CompoundAssignOp') {
    var assignee = node.assignee;
    var expression = node.expression;

    switch (node.op) {
      case 'LogicalOrOp':
      case 'LogicalAndOp':
        var isMemberAccess = /MemberAccessOp$/.test(assignee.type);
        var isDynamicMemberAccess = assignee.type === 'DynamicMemberAccessOp';
        var lhs = undefined;
        var base = isMemberAccess ? assignee.expression.raw : assignee.raw;
        var name = isDynamicMemberAccess ? assignee.indexingExpr.raw : isMemberAccess ? assignee.memberName : null;

        if (isMemberAccess && !(0, _utilsIsSafeToRepeat2['default'])(assignee.expression)) {
          base = (0, _utilsGetFreeBinding2['default'])(node.scope, 'base');
          patcher.insert(assignee.expression.range[0], '(' + base + ' = ');
          patcher.insert(assignee.expression.range[1], ')');
        }

        if (isDynamicMemberAccess && !(0, _utilsIsSafeToRepeat2['default'])(assignee.indexingExpr)) {
          name = (0, _utilsGetFreeBinding2['default'])(node.scope, 'name');
          patcher.insert(assignee.indexingExpr.range[0], name + ' = ');
        }

        if (isDynamicMemberAccess) {
          lhs = base + '[' + name + ']';
        } else if (isMemberAccess) {
          lhs = base + '.' + name;
        } else {
          lhs = base;
        }

        (0, _utilsReplaceBetween2['default'])(patcher, assignee, expression, '=', ' (' + lhs + ' =');
        patcher.insert(expression.range[1], ')');
        return true;
    }
  }
}

module.exports = exports['default'];