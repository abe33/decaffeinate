'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessParameters;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAdjustIndent = require('../utils/adjustIndent');

var _utilsAdjustIndent2 = _interopRequireDefault(_utilsAdjustIndent);

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsIsMultiline = require('../utils/isMultiline');

var _utilsIsMultiline2 = _interopRequireDefault(_utilsIsMultiline);

var _utilsIsParameter = require('../utils/isParameter');

var _utilsIsParameter2 = _interopRequireDefault(_utilsIsParameter);

var _utilsTypes = require('../utils/types');

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function preprocessParameters(node, patcher) {
  if ((0, _utilsTypes.isFunction)(node)) {
    var _ret = (function () {
      var assignments = [];

      node.parameters.forEach(function (param) {
        var thisDotParameter = getThisDotParameter(param);
        if (thisDotParameter) {
          // `@a` -> `a`
          var paramName = (0, _utilsGetFreeBinding2['default'])(node.scope, thisDotParameter.memberName);
          patcher.overwrite(thisDotParameter.range[0], thisDotParameter.range[1], paramName);
          assignments.push('this.' + thisDotParameter.memberName + ' = ' + paramName);
        }
      });

      if (assignments.length > 0) {
        var _ret2 = (function () {
          var indent = (0, _utilsAdjustIndent2['default'])(patcher.original, node.range[0], 1);
          var insertionPoint = node.body ? node.body.range[0] : node.range[1];

          if ((0, _utilsIsMultiline2['default'])(patcher.original, node)) {
            // put each assignment on its own line
            patcher.insert(insertionPoint, assignments.map(function (assignment) {
              return assignment + '\n' + indent;
            }).join(''));
          } else {
            // put the assignments all on one line
            patcher.insert(insertionPoint, ' ' + assignments.join('; '));
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

/**
 * Determines whether this is a `@foo` in the place of a function parameter.
 *
 * @param {Object} node
 * @returns {?Object}
 */
function getThisDotParameter(node) {
  if (!(0, _utilsIsParameter2['default'])(node)) {
    return false;
  }

  if (node.type === 'DefaultParam') {
    node = node.param;
  }

  if (node.type === 'MemberAccessOp' && node.expression.type === 'This') {
    return node;
  } else {
    return null;
  }
}
module.exports = exports['default'];