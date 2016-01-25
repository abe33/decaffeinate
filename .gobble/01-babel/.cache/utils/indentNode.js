'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = indentNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _determineIndent = require('./determineIndent');

var _determineIndent2 = _interopRequireDefault(_determineIndent);

var _repeatString = require('repeat-string');

var _repeatString2 = _interopRequireDefault(_repeatString);

var _trimmedNodeRange = require('./trimmedNodeRange');

var _trimmedNodeRange2 = _interopRequireDefault(_trimmedNodeRange);

/**
 * Indent a node by the given number of levels.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 * @param {number=} levels
 */

function indentNode(node, patcher) {
  var levels = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  if (levels === 0) {
    return;
  }

  var source = patcher.original;
  var range = (0, _trimmedNodeRange2['default'])(node, source);
  var offset = range[0];
  var indent = (0, _repeatString2['default'])((0, _determineIndent2['default'])(source), levels);

  while (offset < range[1]) {
    patcher.insert(offset, indent);
    offset = source.indexOf('\n', offset + '\n'.length);
    if (offset < 0) {
      break;
    }
    offset += '\n'.length;
  }
}

module.exports = exports['default'];