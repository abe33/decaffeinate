'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = indexOfIgnoringComments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rangesOfNonComments = require('./rangesOfNonComments');

var _rangesOfNonComments2 = _interopRequireDefault(_rangesOfNonComments);

/**
 * Finds a string within source, ignoring any comment strings. Returns -1 if
 * no matching substring can be found.
 *
 * @param {string} source
 * @param {string} string
 * @returns {number}
 */

function indexOfIgnoringComments(source, string) {
  var ranges = (0, _rangesOfNonComments2['default'])(source);

  for (var i = 0; i < ranges.length; i++) {
    var _ranges$i = ranges[i];
    var start = _ranges$i.start;
    var end = _ranges$i.end;

    var index = source.slice(start, end).indexOf(string);
    if (index !== -1) {
      return start + index;
    }
  }

  return -1;
}

module.exports = exports['default'];