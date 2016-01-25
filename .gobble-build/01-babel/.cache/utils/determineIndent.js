/**
 * @param {string} source
 * @returns {string}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = determineIndent;

function determineIndent(source) {
  var minIndent = null;
  var maxIndent = null;
  var tabs = false;

  source.split('\n').forEach(function (line) {
    var match = line.match(/(\s*)/);
    if (match) {
      var thisIndent = match[1];
      if (thisIndent[0] === '\t') {
        tabs = true;
      }
      if (!minIndent || minIndent.length > thisIndent.length) {
        minIndent = thisIndent;
      }
      if (!maxIndent || maxIndent.length < thisIndent.length) {
        maxIndent = thisIndent;
      }
    }
  });

  if (tabs) {
    return '\t';
  }

  if (!minIndent || minIndent.length < 2) {
    return '  ';
  }

  if (maxIndent.length % minIndent.length !== 0) {
    return '  ';
  }

  return minIndent;
}

module.exports = exports['default'];