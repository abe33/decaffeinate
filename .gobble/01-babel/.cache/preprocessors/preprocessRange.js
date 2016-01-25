'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = preprocessRange;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAdjustIndent = require('../utils/adjustIndent');

var _utilsAdjustIndent2 = _interopRequireDefault(_utilsAdjustIndent);

var _utilsDetermineIndent = require('../utils/determineIndent');

var _utilsDetermineIndent2 = _interopRequireDefault(_utilsDetermineIndent);

var _utilsGetIndent = require('../utils/getIndent');

var _utilsGetIndent2 = _interopRequireDefault(_utilsGetIndent);

var _utilsGetFreeBinding = require('../utils/getFreeBinding');

var _utilsGetFreeBinding2 = _interopRequireDefault(_utilsGetFreeBinding);

var _utilsIsSafeToRepeat = require('../utils/isSafeToRepeat');

var _utilsIsSafeToRepeat2 = _interopRequireDefault(_utilsIsSafeToRepeat);

var _utilsStripSharedIndent = require('../utils/stripSharedIndent');

var _utilsStripSharedIndent2 = _interopRequireDefault(_utilsStripSharedIndent);

var MAX_RANGE_LITERAL_VALUES = 20;

/**
 * Patches ranges.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function preprocessRange(node, patcher) {
  if (node.type === 'Range') {
    var _ret = (function () {
      var parentNode = node.parentNode;

      if (parentNode.type === 'ForIn' && parentNode.target === node) {
        // Don't re-write the range in `for n in [0..5]`
        return {
          v: false
        };
      }
      var resultBinding = (0, _utilsGetFreeBinding2['default'])(node.scope, 'result');
      var iBinding = (0, _utilsGetFreeBinding2['default'])(node.scope, 'i');
      var left = node.left;
      var right = node.right;

      if (left.type === 'Int' && right.type === 'Int') {
        var isAscending = left.data <= right.data;
        var lastValue = node.isInclusive ? right.data : right.data + (isAscending ? -1 : 1);
        if (Math.abs(lastValue - left.data) <= MAX_RANGE_LITERAL_VALUES) {
          var numbers = [];
          if (isAscending) {
            for (var i = left.data; i <= lastValue; i++) {
              numbers.push(i);
            }
          } else {
            for (var i = left.data; i >= lastValue; i--) {
              numbers.push(i);
            }
          }
          patcher.overwrite(left.range[0], right.range[1], numbers.join(', '));
          return {
            v: true
          };
        } else {
          var indent0 = (0, _utilsAdjustIndent2['default'])(patcher.original, node.range[0], 0);
          var indent1 = (0, _utilsAdjustIndent2['default'])(patcher.original, node.range[0], 1);
          patcher.overwrite(node.range[0], node.range[1], (0, _utilsStripSharedIndent2['default'])('\n            (do ->\n              ' + indent0 + resultBinding + ' = []\n              ' + indent0 + iBinding + ' = ' + left.raw + '\n              ' + indent0 + 'while ' + iBinding + ' ' + (isAscending ? node.isInclusive ? '<=' : '<' : node.isInclusive ? '>=' : '>') + ' ' + right.raw + '\n              ' + indent1 + resultBinding + '.push(' + iBinding + (isAscending ? '++' : '--') + ')\n              ' + indent0 + resultBinding + ')\n          '));
          return {
            v: true
          };
        }
      }

      var indent = (0, _utilsDetermineIndent2['default'])(patcher.original);
      var lead = (0, _utilsGetIndent2['default'])(patcher.original, node.range[0]) + indent;
      var isStartSafeToRepeat = (0, _utilsIsSafeToRepeat2['default'])(left);
      var isEndSafeToRepeat = (0, _utilsIsSafeToRepeat2['default'])(right);
      var start = isStartSafeToRepeat ? left.raw : (0, _utilsGetFreeBinding2['default'])(node.scope, 'start');
      var end = isEndSafeToRepeat ? right.raw : (0, _utilsGetFreeBinding2['default'])(node.scope, 'end');

      var lines = [];

      lines.push(resultBinding + ' = []');
      if (!isStartSafeToRepeat) {
        lines.push(start + ' = ' + left.raw);
      }
      if (!isEndSafeToRepeat) {
        lines.push(end + ' = ' + right.raw);
      }
      lines.push(iBinding + ' = ' + start, 'if ' + start + ' <= ' + end, indent + 'while ' + iBinding + ' ' + (node.isInclusive ? '<=' : '<') + ' ' + end, '' + indent + indent + resultBinding + '.push(' + iBinding + '++)', 'else', indent + 'while ' + iBinding + ' ' + (node.isInclusive ? '>=' : '>') + ' ' + end, '' + indent + indent + resultBinding + '.push(' + iBinding + '--)', '' + resultBinding);

      patcher.overwrite(node.range[0], node.range[1], '(do ->\n' + lines.map(function (line) {
        return lead + line;
      }).join('\n') + ')');
      return {
        v: true
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  }
}

module.exports = exports['default'];