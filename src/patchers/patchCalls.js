import appendToNode from '../utils/appendToNode';
import getIndent from '../utils/getIndent';
import isImplicitObject from '../utils/isImplicitObject';
import rangeIncludingParentheses from '../utils/rangeIncludingParentheses';
import trimmedNodeRange from '../utils/trimmedNodeRange';
import { getNodeEnd } from '../utils/nodeEnd';

/**
 * Adds tokens necessary to open a function call.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
export function patchCallOpening(node, patcher) {
  if (node.type === 'FunctionApplication') {
    addTokensIfNeeded(node.function, node.arguments);
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
      const firstArgument = callArguments[0];
      if (isImplicitObject(firstArgument, patcher.original)) {
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
      const firstArgument = callArguments[0];
      const lastArgument = callArguments[callArguments.length - 1];

      if (callee.line === lastArgument.line) {
        patcher.overwrite(
          callee.range[1],
          rangeIncludingParentheses(firstArgument.range, patcher.original)[0],
          isImplicitObject(firstArgument, patcher.original) ? '({' : '('
        );
      } else {
        patcher.insert(
          callee.range[1],
          isImplicitObject(firstArgument, patcher.original) ? '({' : '('
        );
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
export function patchCallClosing(node, patcher) {
  if (node.type === 'FunctionApplication') {
    addTokensIfNeeded(node.function, node.arguments);
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
      const lastArgument = callArguments[callArguments.length - 1];
      if (isImplicitObject(lastArgument, patcher.original)) {
        addObjectBrace(lastArgument);
      }
    }
  }

  /**
   * @param {Object} n
   */
  function addObjectBrace(n) {
    patcher.insert(trimmedNodeRange(n, patcher.original)[1], '}');
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
      const lastArgument = callArguments[callArguments.length - 1];
      const lastArgumentRange = trimmedNodeRange(lastArgument, patcher.original);

      if (callee.line === lastArgument.line) {
        appendToNode(
          lastArgument,
          patcher,
          isImplicitObject(lastArgument, patcher.original) ? '})' : ')',
          Math.max(lastArgumentRange[1], getNodeEnd(lastArgument))
        );
      } else {
        const indent = getIndent(patcher.original, callee.range[1]);
        appendToNode(
          lastArgument,
          patcher,
          isImplicitObject(lastArgument, patcher.original) ? `\n${indent}})` : `\n${indent})`,
          Math.max(lastArgumentRange[1], getNodeEnd(lastArgument))
        );
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
  const calleeRangeIncludingParentheses = rangeIncludingParentheses(callee.range, source);
  return source[calleeRangeIncludingParentheses[1]] === '(';
}
