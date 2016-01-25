'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = rangesOfNonComments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rangesOfComments = require('./rangesOfComments');

var _rangesOfComments2 = _interopRequireDefault(_rangesOfComments);

/**
 * Returns the ranges of the sections of source code that are not comments.
 *
 * @param {string} source
 * @returns {Array.<{start: number, end: number}>}
 */

function rangesOfNonComments(source) {
  var index = 0;
  var ranges = [];

  (0, _rangesOfComments2['default'])(source).forEach(function (_ref) {
    var start = _ref.start;
    var end = _ref.end;

    if (start !== index) {
      ranges.push({ start: index, end: start });
    }
    index = end;
  });

  if (index < source.length) {
    ranges.push({ start: index, end: source.length });
  }

  return ranges;
}

module.exports = exports['default'];