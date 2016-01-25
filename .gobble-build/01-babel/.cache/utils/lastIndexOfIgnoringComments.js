'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = lastIndexOfIgnoringComments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rangesOfNonComments = require('./rangesOfNonComments');

var _rangesOfNonComments2 = _interopRequireDefault(_rangesOfNonComments);

/**
 * Finds the last index of a string inside source code ignoring comments.
 * Returns -1 if no match is found.
 *
 * @param {string} source
 * @param {string} string
 * @param {number=} fromIndex
 * @returns {number}
 */

function lastIndexOfIgnoringComments(source, string) {
  var fromIndex = arguments.length <= 2 || arguments[2] === undefined ? source.length : arguments[2];
  return (function () {
    var ranges = (0, _rangesOfNonComments2['default'])(source);

    for (var i = ranges.length - 1; i >= 0; i--) {
      var _ranges$i = ranges[i];
      var start = _ranges$i.start;
      var end = _ranges$i.end;

      if (fromIndex < start) {
        continue;
      }
      var index = source.slice(start, end).lastIndexOf(string, fromIndex - start);
      if (index !== -1) {
        return start + index;
      }
    }

    return -1;
  })();
}

module.exports = exports['default'];