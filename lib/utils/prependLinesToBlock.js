'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = prependLinesToBlock;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _getIndent = require('./getIndent');

var _getIndent2 = _interopRequireDefault(_getIndent);

/**
 * @param {MagicString} patcher
 * @param {string[]} lines
 * @param {Object} node
 */

function prependLinesToBlock(patcher, lines, node) {
  var indent = (0, _getIndent2['default'])(patcher.original, node.range[0]);
  var string = '';

  for (var i = 0; i < lines.length; i++) {
    string += lines[i] + '\n';
    if (i + 1 === lines.length || lines[i + 1].length > 0) {
      string += indent;
    }
  }

  patcher.insert(node.range[0], string);
}

module.exports = exports['default'];