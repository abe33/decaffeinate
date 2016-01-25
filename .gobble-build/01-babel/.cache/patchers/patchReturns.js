'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchReturns;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsImplicitlyReturned = require('../utils/isImplicitlyReturned');

var _utilsIsImplicitlyReturned2 = _interopRequireDefault(_utilsIsImplicitlyReturned);

/**
 * Inserts return keywords
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchReturns(node, patcher) {
  if ((0, _utilsIsImplicitlyReturned2['default'])(node)) {
    patcher.insert(node.range[0], 'return ');
  }
}

module.exports = exports['default'];