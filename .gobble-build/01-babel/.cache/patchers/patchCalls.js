'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchCallOpening = patchCallOpening;
exports.patchCallClosing = patchCallClosing;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetIndent = require('../utils/getIndent');

var _utilsGetIndent2 = _interopRequireDefault(_utilsGetIndent);

var _utilsIsImplicitObject = require('../utils/isImplicitObject');

var _utilsIsImplicitObject2 = _interopRequireDefault(_utilsIsImplicitObject);

var _utilsRangeIncludingParentheses = require('../utils/rangeIncludingParentheses');

var _utilsRangeIncludingParentheses2 = _interopRequireDefault(_utilsRangeIncludingParentheses);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

/**
 * Adds tokens necessary to open a function call.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchCallOpening(node, patcher) {
  if (node.type === 'FunctionApplication') {
    addTokensIfNeeded(node['function'], node.arguments);
  } else if (node.type === 'NewOp') {
    addTokensIfNeeded(node.ctor, node.arguments);
  }

  /**
   * @param {Object} callee
   * @param {Object[]} callArguments
   */
  function addTokensIfNeeded(callee, callArguments) {
    if (!callHasParentheses(callee, patcher.original)) {
      addTokens(callee, callArguments);
    } else {
      var firstArgument = callArguments[0];
      if ((0, _utilsIsImplicitObject2['default'])(firstArgument, patcher.original)) {
        addObjectBrace(firstArgument);
      }
    }
  }

  /**
   * Adds an opening object brace at the start of the given node.
   *
   * @param {Object} n
   */
  function addObjectBrace(n) {
    patcher.insert(n.range[0], '{');
  }

  /**
   * Adds an opening parenthesis and, if necessary, an object brace.
   *
   * @param {Object} callee
   * @param {Object[]} callArguments
   */
  function addTokens(callee, callArguments) {
    if (callArguments.length === 0) {
      patcher.insert(callee.range[1], '(');
    } else {
      var firstArgument = callArguments[0];
      var lastArgument = callArguments[callArguments.length - 1];

      if (callee.line === lastArgument.line) {
        patcher.overwrite(callee.range[1], firstArgument.range[0], (0, _utilsIsImplicitObject2['default'])(firstArgument, patcher.original) ? '({' : '(');
      } else {
        patcher.insert(callee.range[1], (0, _utilsIsImplicitObject2['default'])(firstArgument, patcher.original) ? '({' : '(');
      }
    }
  }
}

/**
 * Adds tokens necessary to close the given function call.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchCallClosing(node, patcher) {
  if (node.type === 'FunctionApplication') {
    addTokensIfNeeded(node['function'], node.arguments);
  } else if (node.type === 'NewOp') {
    addTokensIfNeeded(node.ctor, node.arguments);
  }

  /**
   * @param {Object} callee
   * @param {Object[]} callArguments
   */
  function addTokensIfNeeded(callee, callArguments) {
    if (!callHasParentheses(callee, patcher.original)) {
      addTokens(callee, callArguments);
    } else {
      var lastArgument = callArguments[callArguments.length - 1];
      if ((0, _utilsIsImplicitObject2['default'])(lastArgument, patcher.original)) {
        addObjectBrace(lastArgument);
      }
    }
  }

  /**
   * @param {Object} n
   */
  function addObjectBrace(n) {
    patcher.insert((0, _utilsTrimmedNodeRange2['default'])(n, patcher.original)[1], '}');
  }

  /**
   * Adds a closing parenthesis and, if necessary, an object brace.
   *
   * @param {Object} callee
   * @param {Object[]} callArguments
   */
  function addTokens(callee, callArguments) {
    if (callArguments.length === 0) {
      patcher.insert(callee.range[1], ')');
    } else {
      var lastArgument = callArguments[callArguments.length - 1];
      var lastArgumentRange = (0, _utilsTrimmedNodeRange2['default'])(lastArgument, patcher.original);

      if (callee.line === lastArgument.line) {
        patcher.insert(lastArgumentRange[1], (0, _utilsIsImplicitObject2['default'])(lastArgument, patcher.original) ? '})' : ')');
      } else {
        var indent = (0, _utilsGetIndent2['default'])(patcher.original, callee.range[1]);
        patcher.insert(lastArgumentRange[1], (0, _utilsIsImplicitObject2['default'])(lastArgument, patcher.original) ? '\n' + indent + '})' : '\n' + indent + ')');
      }
    }
  }
}

/**
 * @param {Object} callee
 * @param {string} source
 * @returns {boolean}
 */
function callHasParentheses(callee, source) {
  var calleeRangeIncludingParentheses = (0, _utilsRangeIncludingParentheses2['default'])(callee, source);
  return source[calleeRangeIncludingParentheses[1]] === '(';
}