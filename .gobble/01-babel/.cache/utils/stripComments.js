'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = stripComments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rangesOfComments = require('./rangesOfComments');

var _rangesOfComments2 = _interopRequireDefault(_rangesOfComments);

/**
 * @param {string} source
 * @returns {string}
 */

function stripComments(source) {
  var result = '';
  var lastCommentEnd = 0;

  (0, _rangesOfComments2['default'])(source).forEach(function (_ref) {
    var start = _ref.start;
    var end = _ref.end;

    result += source.slice(lastCommentEnd, start);
    lastCommentEnd = end;
  });

  result += source.slice(lastCommentEnd);

  return result;
}

module.exports = exports['default'];