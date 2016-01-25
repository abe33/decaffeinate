'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchKeywords;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsReplaceBetween = require('../utils/replaceBetween');

var _utilsReplaceBetween2 = _interopRequireDefault(_utilsReplaceBetween);

/**
 * Renames keywords to the JavaScript equivalent.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchKeywords(node, patcher) {
  switch (node.type) {
    case 'Bool':
      switch (node.raw) {
        case 'yes':
          patcher.overwrite(node.range[0], node.range[1], 'true');
          break;

        case 'no':
          patcher.overwrite(node.range[0], node.range[1], 'false');
          break;
      }
      break;

    case 'LogicalAndOp':
      (0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, 'and', '&&');
      break;

    case 'LogicalOrOp':
      (0, _utilsReplaceBetween2['default'])(patcher, node.left, node.right, 'or', '||');
      break;

    case 'LogicalNotOp':
      if (node.raw.slice(0, 4) === 'not ') {
        patcher.overwrite(node.range[0], node.range[0] + 4, '!');
      } else if (node.raw.slice(0, 3) === 'not') {
        patcher.overwrite(node.range[0], node.range[0] + 3, '!');
      }
      break;
  }
}

module.exports = exports['default'];