'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = makeIIFE;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _getIndent = require('./getIndent');

var _getIndent2 = _interopRequireDefault(_getIndent);

var _indentNode = require('./indentNode');

var _indentNode2 = _interopRequireDefault(_indentNode);

var _trimmedNodeRange = require('./trimmedNodeRange');

var _trimmedNodeRange2 = _interopRequireDefault(_trimmedNodeRange);

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function makeIIFE(node, patcher) {
  var range = (0, _trimmedNodeRange2['default'])(node, patcher.original);
  var indent = (0, _getIndent2['default'])(patcher.original, range[0]);
  patcher.insert(range[0], '(=>\n' + indent);
  (0, _indentNode2['default'])(node, patcher);
  patcher.insert(range[1], ')()');
}

module.exports = exports['default'];