'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchObjectBraceOpening = patchObjectBraceOpening;
exports.patchObjectBraceClosing = patchObjectBraceClosing;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsImplicitObject = require('../utils/isImplicitObject');

var _utilsIsImplicitObject2 = _interopRequireDefault(_utilsIsImplicitObject);

var _utilsIsImplicitlyReturned = require('../utils/isImplicitlyReturned');

var _utilsIsImplicitlyReturned2 = _interopRequireDefault(_utilsIsImplicitlyReturned);

var _utilsTypes = require('../utils/types');

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchObjectBraceOpening(node, patcher) {
  if (node.type === 'ObjectInitialiser') {
    if (node.parentNode.type !== 'FunctionApplication') {
      if (isObjectAsStatement(node)) {
        patcher.insert(node.range[0], '(');
      }
      if ((0, _utilsIsImplicitObject2['default'])(node, patcher.original)) {
        patcher.insert(node.range[0], '{');
      }
    } else {
      if (node !== node.parentNode.arguments[0]) {
        // Not the first argument, which is handled by `patchCalls`, so we handle it.
        if ((0, _utilsIsImplicitObject2['default'])(node, patcher.original)) {
          patcher.insert(node.range[0], '{');
        }
      }
    }
  } else if (node.type === 'ObjectInitialiserMember' && node.expression.type === 'Function') {
    patcher.overwrite(node.key.range[1], node.expression.range[0], '');
  }
}

/**
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchObjectBraceClosing(node, patcher) {
  if (node.type === 'ObjectInitialiser') {
    if (node.parentNode.type !== 'FunctionApplication') {
      if (patcher.original[node.range[0]] !== '{') {
        patcher.insert(node.range[1], isObjectAsStatement(node) ? '})' : '}');
      } else if (isObjectAsStatement(node)) {
        patcher.insert(node.range[1], ')');
      }
    } else {
      if (node !== node.parentNode.arguments[node.parentNode.arguments.length - 1]) {
        // Not the last argument, which is handled by `patchCalls`, so we handle it.
        if ((0, _utilsIsImplicitObject2['default'])(node, patcher.original)) {
          patcher.insert(node.range[1], '}');
        }
      }
    }
  }
}

/**
 * @param {Object} node
 * @returns {boolean}
 */
function isObjectAsStatement(node) {
  if (node.parentNode.type !== 'Block' && !(0, _utilsTypes.isConsequentOrAlternate)(node)) {
    return false;
  }

  return !(0, _utilsIsImplicitlyReturned2['default'])(node);
}