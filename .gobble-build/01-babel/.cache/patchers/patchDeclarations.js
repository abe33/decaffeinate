'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchDeclarations;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsGetIndent = require('../utils/getIndent');

var _utilsGetIndent2 = _interopRequireDefault(_utilsGetIndent);

var _utilsIsExpressionResultUsed = require('../utils/isExpressionResultUsed');

var _utilsIsExpressionResultUsed2 = _interopRequireDefault(_utilsIsExpressionResultUsed);

var _utilsLeftHandIdentifiers = require('../utils/leftHandIdentifiers');

var _utilsLeftHandIdentifiers2 = _interopRequireDefault(_utilsLeftHandIdentifiers);

/**
 * Adds declarations for variable assignments.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchDeclarations(node, patcher) {
  if (node.type === 'AssignOp' && !isExpressionAssignment(node)) {
    var identifiers = (0, _utilsLeftHandIdentifiers2['default'])(node.assignee);
    var requiresDeclaration = identifiers.some(function (identifier) {
      return node.scope.getBinding(identifier.data) === identifier;
    });

    if (requiresDeclaration) {
      patcher.insert(node.range[0], 'var ');
    } else if (node.assignee.type === 'ObjectInitialiser') {
      // Object destructuring not part of a variable declaration needs parens.
      patcher.insert(node.assignee.range[0], '(').insert(node.assignee.range[1], ')');
    }
  } else if (node.type === 'Block') {
    (function () {
      var names = [];
      node.scope.getOwnNames().forEach(function (name) {
        var binding = node.scope.getBinding(name);
        var assignment = findAssignmentForBinding(binding);
        if (isExpressionAssignment(assignment) && isFirstParentBlock(node, assignment)) {
          names.push(name);
        }
      });
      if (names.length > 0) {
        (function () {
          var firstStatementStart = node.statements[0].range[0];
          var indent = (0, _utilsGetIndent2['default'])(patcher.original, firstStatementStart);
          var declarations = names.map(function (name) {
            return 'var ' + name + ';\n' + indent;
          }).join('');
          patcher.insert(firstStatementStart, declarations);
        })();
      }
    })();
  }
}

/**
 * Determines whether a node is an assignment in an expression context.
 *
 * @param {Object?} node
 * @returns {boolean}
 */
function isExpressionAssignment(node) {
  if (!node || node.type !== 'AssignOp') {
    return false;
  }

  return (0, _utilsIsExpressionResultUsed2['default'])(node);
}

/**
 * Finds the AssignOp node associated with a binding identifier.
 *
 * @param {Object} binding Identifier
 * @returns {Object} AssignOp
 */
function findAssignmentForBinding(binding) {
  var assignment = binding;

  while (assignment && assignment.type !== 'AssignOp') {
    assignment = assignment.parentNode;
  }

  return assignment;
}

/**
 * Determines whether a node's first containing block is the given block.
 *
 * @param {Object} block
 * @param {Object} node
 * @returns {boolean}
 */
function isFirstParentBlock(block, node) {
  while (node && node.type !== 'Block') {
    node = node.parentNode;
  }

  return node === block;
}
module.exports = exports['default'];