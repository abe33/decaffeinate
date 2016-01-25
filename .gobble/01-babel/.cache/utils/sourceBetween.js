/**
 * Get the source between the two given nodes.
 *
 * @param {string} source
 * @param {Object} left
 * @param {Object} right
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = sourceBetween;

function sourceBetween(source, left, right) {
  return source.slice(left.range[1], right.range[0]);
}

module.exports = exports["default"];