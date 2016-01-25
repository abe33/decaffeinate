'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isImplicitlyReturned;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _traverse = require('./traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _types = require('./types');

/**
 * Determines whether the given node is implicitly returned.
 *
 * @param node
 * @returns {boolean}
 */

function isImplicitlyReturned(node) {
  if (!node.parentNode) {
    return false;
  }

  switch (node.type) {
    case 'Return':
    case 'Block':
    case 'Conditional':
    case 'Try':
    case 'Throw':
    case 'Switch':
      return false;

    case 'ForIn':
    case 'ForOf':
    case 'While':
      return couldContainImplicitReturn(node) && !explicitlyReturns(node);

    default:
      return couldContainImplicitReturn(node);
  }
}

/**
 * Determines whether the given node could contain an implicit return.
 *
 * @param {Object} node
 * @returns {boolean}
 * @private
 */
function couldContainImplicitReturn(_x) {
  var _left;

  var _again = true;

  _function: while (_again) {
    var node = _x;
    _again = false;
    var parentNode = node.parentNode;

    if (!parentNode) {
      /*
       * Program is only one without a parent, and is not in return position.
       */
      return false;
    }

    if (parentNode.type === 'Function' && node === parentNode.body) {
      /*
       * Function body is nearly always in return position, whether it's a block:
       *
       *   ->
       *     implicitlyReturned
       *
       * or not:
       *
       *   -> implicitlyReturned
       *
       * The one exception is class constructors, which should not have implicit
       * returns:
       *
       *   class Foo
       *     constructor: ->
       *       notImplicitlyReturned
       */
      return parentNode.parentNode.type !== 'Constructor';
    }

    if (parentNode.type === 'BoundFunction' && node.type === 'Block') {
      /*
       * Blocks in bound functions are in a return position:
       *
       *   =>
       *     implicitlyReturned
       *
       * Note that if the body of a bound function is not a block then we do not
       * consider it in a return position because no "return" statements need
       * to be created:
       *
       *   => notImplicitlyReturned
       */
      return true;
    }

    if (parentNode.type === 'Block') {
      /*
       * Block statements are implicitly returned only if they are the last
       * statement:
       *
       *   neverImplicitlyReturned
       *   mightBeImplicitlyReturned
       *
       * In addition, the block itself must be in a position is part of the
       * implicit return chain, such as a function body:
       *
       *   ->
       *     notImplicitlyReturned
       *     implicitlyReturned
       */

      if (!(_left = isLastStatement(node))) {
        return _left;
      }

      _x = parentNode;
      _again = true;
      parentNode = undefined;
      continue _function;
    }

    if (parentNode.type === 'Conditional' && node !== parentNode.condition) {
      /*
       * A consequent or alternate is in return position iff its parent
       * conditional is:
       *
       *   if notImplicitlyReturned
       *     mightBeImplicitlyReturned
       *   else
       *     mightBeImplicitlyReturned
       */
      _x = parentNode;
      _again = true;
      parentNode = undefined;
      continue _function;
    }

    if (parentNode.type === 'Try' && node !== parentNode.catchAssignee) {
      /*
       * All of the try/catch/finally blocks under a `try` are in return position
       * iff the `try` itself is:
       *
       *   try
       *     mightBeImplicitlyReturned
       *   catch notImplicitlyReturned
       *     mightBeImplicitlyReturned
       *   finally
       *     mightBeImplicitlyReturned
       */
      _x = parentNode;
      _again = true;
      parentNode = undefined;
      continue _function;
    }

    if (parentNode.type === 'SwitchCase' && node === parentNode.consequent) {
      /*
       * Consequents for a `switch` case are in return position iff the `switch`
       * itself is:
       *
       *   switch notImplicitlyReturned
       *     when notImplicitlyReturned then mightBeImplicitlyReturned
       *     when notImplicitlyReturned
       *       mightBeImplicitlyReturned
       */
      _x = /* Switch */parentNode.parentNode;
      _again = true;
      parentNode = undefined;
      continue _function;
    }

    if (parentNode.type === 'Switch' && node === parentNode.alternate) {
      /*
       * Alternates for `switch` statements are in return position iff the
       * `switch` itself is:
       *
       *   switch notImplicitlyReturned
       *     …
       *     else mightBeImplicitlyReturned
       */
      _x = parentNode;
      _again = true;
      parentNode = undefined;
      continue _function;
    }

    return false;
  }
}

/**
 * @param {Object} node
 * @returns {boolean}
 * @private
 */
function isLastStatement(node) {
  if (node.parentNode && node.parentNode.type !== 'Block') {
    return false;
  }

  var statements = node.parentNode.statements;
  var index = statements.indexOf(node);

  if (index < 0) {
    return false;
  }

  return index === statements.length - 1;
}

/**
 * @param {Object} node
 * @returns {boolean}
 */
function explicitlyReturns(node) {
  var result = false;
  (0, _traverse2['default'])(node, function (child) {
    if (result) {
      // Already found a return, just bail.
      return false;
    } else if ((0, _types.isFunction)(child)) {
      // Don't look inside functions.
      return false;
    } else if (child.type === 'Return') {
      result = true;
      return false;
    }
  });
  return result;
}
module.exports = exports['default'];