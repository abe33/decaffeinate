'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = convertBoundFunctionToUnboundFunction;
var BOUND_ARROW = '=>';
var UNBOUND_ARROW = '->';

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function convertBoundFunctionToUnboundFunction(node, patcher) {
  var source = patcher.original;

  var _node$range = _slicedToArray(node.range, 2);

  var start = _node$range[0];
  var end = _node$range[1];

  var offset = start;

  if (node.parameters.length > 0) {
    offset = node.parameters[node.parameters.length - 1].range[1];
  }

  var index = source.indexOf(BOUND_ARROW, offset);

  if (index < offset && index >= end) {
    throw new Error('unable to locate arrow in bound function: ' + JSON.stringify(node.raw));
  }

  patcher.overwrite(index, index + BOUND_ARROW.length, UNBOUND_ARROW);
}

module.exports = exports['default'];