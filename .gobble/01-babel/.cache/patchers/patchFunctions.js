'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.patchFunctionStart = patchFunctionStart;
exports.patchFunctionEnd = patchFunctionEnd;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsAppendClosingBrace = require('../utils/appendClosingBrace');

var _utilsAppendClosingBrace2 = _interopRequireDefault(_utilsAppendClosingBrace);

var _utilsIsMultiline = require('../utils/isMultiline');

var _utilsIsMultiline2 = _interopRequireDefault(_utilsIsMultiline);

var _utilsIsStatement = require('../utils/isStatement');

var _utilsIsStatement2 = _interopRequireDefault(_utilsIsStatement);

var _utilsShouldHaveTrailingSemicolon = require('../utils/shouldHaveTrailingSemicolon');

var _utilsShouldHaveTrailingSemicolon2 = _interopRequireDefault(_utilsShouldHaveTrailingSemicolon);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

var _utilsTypes = require('../utils/types');

/**
 * Patches the start of arrow functions to make them into JavaScript functions.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchFunctionStart(node, patcher) {
  switch (node.type) {
    case 'Function':
      if (!isMethodDeclaration(node)) {
        patchUnboundFunctionStart(node, patcher, isConciseObjectMethod(node));
      }
      break;

    case 'BoundFunction':
      if (!isMethodDeclaration(node)) {
        patchBoundFunctionStart(node, patcher);
      }
      break;

    case 'ClassProtoAssignOp':
      if (node.expression.type === 'Function') {
        patchConciseUnboundFunctionStart(node, patcher);
      }
      break;

    case 'Constructor':
      patchConciseUnboundFunctionStart(node, patcher);
      break;
  }
}

/**
 * Determines whether a node is a method declaration.
 *
 * @param {Object} node
 * @returns {boolean}
 */
function isMethodDeclaration(node) {
  return (0, _utilsTypes.isFunction)(node) && (node.parentNode.type === 'ClassProtoAssignOp' || node.parentNode.type === 'Constructor');
}

/**
 * Determines whether a node is a concise method declaration.
 *
 * @param {Object} node
 * @returns {boolean}
 */
function isConciseObjectMethod(node) {
  return (0, _utilsTypes.isFunction)(node) && node.parentNode.type === 'ObjectInitialiserMember';
}

/**
 * Converts unbound functions into regular functions.
 *
 * @param {Object} node Function
 * @param {MagicString} patcher
 * @param {boolean=} concise
 */
function patchUnboundFunctionStart(node, patcher) {
  var concise = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var start = node.range[0];
  var fn = concise ? '' : 'function';
  if (patcher.slice(start, start + 2) === '->') {
    patcher.overwrite(start, start + 2, '' + ((0, _utilsIsStatement2['default'])(node) ? '(' : '') + fn + '() {');
  } else {
    patcher.insert(start, (0, _utilsIsStatement2['default'])(node) ? '(' + fn : fn);

    var arrowStart = patcher.original.indexOf('->', start);

    if (arrowStart < 0) {
      throw new Error('unable to find `->` for function starting at line ' + node.line + ', column ' + node.column);
    }

    patcher.overwrite(arrowStart, arrowStart + 2, '{');
  }
}

/**
 * Converts bound functions into arrow functions.
 *
 * @param {Object} node BoundFunction
 * @param {MagicString} patcher
 */
function patchBoundFunctionStart(node, patcher) {
  if (patcher.slice(node.range[0], node.range[0] + 1) !== '(') {
    patcher.insert(node.range[0], '() ');
  }

  if (node.body.type === 'Block') {
    var arrowStart = node.parameters.length > 0 ? node.parameters[node.parameters.length - 1].range[1] : node.range[0];

    arrowStart = patcher.original.indexOf('=>', arrowStart);

    if (arrowStart < 0) {
      throw new Error('unable to find `=>` for function starting at line ' + node.line + ', column ' + node.column);
    }

    patcher.insert(arrowStart + 2, ' {');
  } else if (node.body.type === 'SeqOp') {
    // Wrap sequences in parens, e.g. `a; b` becomes `(a, b)`.
    patcher.insert(node.body.range[0], '(');
  }
}

/**
 * Converts bound functions into arrow functions.
 *
 * @param {Object} node ClassProtoAssignOp|Constructor
 * @param {MagicString} patcher
 */
function patchConciseUnboundFunctionStart(node, patcher) {
  var keyRange = node.type === 'Constructor' ? [node.range[0], node.range[0] + 'constructor'.length] : node.assignee.range;
  var fn = node.expression;
  var start = fn.range[0];
  if (patcher.slice(start, start + 2) === '->') {
    patcher.overwrite(keyRange[1], start + 2, '() {');
  } else {
    patcher.overwrite(keyRange[1], fn.range[0], '');

    var arrowStart = patcher.original.indexOf('->', start);

    if (arrowStart < 0) {
      throw new Error('unable to find `->` for function starting at line ' + fn.line + ', column ' + fn.column);
    }

    patcher.overwrite(arrowStart, arrowStart + 2, '{');
  }
}

/**
 * Patches the end of arrow functions to make them into JavaScript functions.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchFunctionEnd(node, patcher) {
  if ((0, _utilsTypes.isFunction)(node)) {
    var insertionPoint = (0, _utilsTrimmedNodeRange2['default'])(node, patcher.original)[1];
    var functionClose = '';

    if ((0, _utilsIsMultiline2['default'])(patcher.original, node)) {
      insertionPoint = (0, _utilsAppendClosingBrace2['default'])(node, patcher);
    } else if (node.type === 'Function') {
      functionClose = node.body ? ' }' : '}';
    }

    if (node.type === 'Function' && (0, _utilsIsStatement2['default'])(node)) {
      functionClose += ')';
    } else if (node.type === 'BoundFunction' && node.body.type === 'SeqOp') {
      // Wrap sequences in parens, e.g. `a; b` becomes `(a, b)`.
      functionClose += ')';
    }

    if ((0, _utilsShouldHaveTrailingSemicolon2['default'])(node)) {
      // Handle the closing semicolon here because otherwise it's difficult to
      // reproduce the insertion position in `patchSemicolons`.
      functionClose += ';';
    }

    if (functionClose) {
      patcher.insert(insertionPoint, functionClose);
    }
  }
}