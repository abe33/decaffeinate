/**
 * Determine whether CoffeeScript would consider repeating the given node to be
 * safe. The reality is that CoffeeScript is a little more cavalier than I would
 * be since even a reference to an unbound variable can have side effects. This
 * reflects what CoffeeScript does so as to maintain behavioral compatibility.
 *
 * @param {Object} node
 * @returns {boolean}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isSafeToRepeat;

function isSafeToRepeat(_x) {
  var _left;

  var _again = true;

  _function: while (_again) {
    var node = _x;
    _again = false;

    switch (node.type) {
      case 'Identifier':
      case 'Int':
      case 'Float':
        return true;

      case 'MemberAccessOp':
        _x = node.expression;
        _again = true;
        continue _function;

      case 'DynamicMemberAccessOp':
        if (!(_left = isSafeToRepeat(node.expression))) {
          return _left;
        }

        _x = node.indexingExpr;
        _again = true;
        continue _function;

      default:
        return false;
    }
  }
}

module.exports = exports['default'];