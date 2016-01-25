"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports["default"] = buildLineAndColumnMap;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CR = 10; // \r
var LF = 13; // \n

/**
 * Maps between line/column pairs and offsets for the given source.
 */

var LineAndColumnMap = (function () {
  /**
   * @param {string} source
   */

  function LineAndColumnMap(source) {
    _classCallCheck(this, LineAndColumnMap);

    var offsets = [0];

    var line = 0;
    var cursor = 0;

    while (cursor < source.length) {
      switch (source.charCodeAt(cursor)) {
        case CR:
          line++;
          cursor++;
          if (source.charCodeAt(cursor + 1) === LF) {
            cursor++;
          }
          offsets[line] = cursor;
          break;

        case LF:
          line++;
          cursor++;
          offsets[line] = cursor;
          break;

        default:
          cursor++;
          break;
      }
    }

    offsets[line + 1] = cursor;
    this.offsets = offsets;
  }

  /**
   * Builds a mapper between line/column pairs and offsets for the given source.
   *
   * @param {string} source
   * @returns {LineAndColumnMap}
   */

  /**
   * Gets the absolute character offset for the position at line & column.
   *
   * @param {number} line
   * @param {number} column
   * @returns {?number}
   */

  _createClass(LineAndColumnMap, [{
    key: "getOffset",
    value: function getOffset(line, column) {
      if (line + 1 >= this.offsets.length) {
        // Line out of bounds.
        return null;
      }

      var thisLineOffset = this.offsets[line];
      var nextLineOffset = this.offsets[line + 1];

      if (nextLineOffset - thisLineOffset < column) {
        // Column out of bounds.
        return null;
      }

      return thisLineOffset + column;
    }

    /**
     * Gets the line & column pair for an absolute character offset.
     *
     * @param {number} offset
     * @returns {?number[]}
     */
  }, {
    key: "getLocation",
    value: function getLocation(offset) {
      if (offset < 0 || this.offsets[this.offsets.length - 1] < offset) {
        // Offset out of bounds.
        return null;
      }

      // We start at offsets.length - 2 because the last entry is used to capture
      // the length of the last line, so there will always be N + 1 entries in
      // offsets for a string with N lines.
      for (var i = this.offsets.length - 2; i >= 0; i--) {
        if (offset >= this.offsets[i]) {
          return [i, offset - this.offsets[i]];
        }
      }
    }
  }]);

  return LineAndColumnMap;
})();

function buildLineAndColumnMap(source) {
  return new LineAndColumnMap(source);
}

module.exports = exports["default"];