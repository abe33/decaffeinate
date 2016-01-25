/**
 * Gets a free binding suitable for a temporary variable.
 *
 * Note that this does *not* prevent using the same binding again, so users of
 * this should call `scope.assigns` or `scope.declares` with the result of this
 * function if they wish to prevent usage of the free binding identified.
 *
 * @param {Scope} scope
 * @param {string=} base
 * @returns {string}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getFreeBinding;
exports.getFreeLoopBinding = getFreeLoopBinding;

function getFreeBinding(scope) {
  var base = arguments.length <= 1 || arguments[1] === undefined ? 'ref' : arguments[1];

  var binding = base;

  if (scope.getBinding(binding)) {
    var counter = 1;
    while (scope.getBinding(binding = '' + base + counter)) {
      counter++;
    }
  }

  return binding;
}

var LOOP_BINDINGS = ['i', 'j', 'k'];

/**
 * Gets a free binding for the purpose of a loop counter.
 *
 * @param {Scope} scope
 * @returns {string}
 */

function getFreeLoopBinding(scope) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = LOOP_BINDINGS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var binding = _step.value;

      if (!scope.getBinding(binding)) {
        return binding;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return getFreeBinding(scope, LOOP_BINDINGS[0]);
}