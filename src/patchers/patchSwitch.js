import adjustIndent from '../utils/adjustIndent';
import appendClosingBrace from '../utils/appendClosingBrace';
import isImplicitlyReturned from '../utils/isImplicitlyReturned';
import isMultiline from '../utils/isMultiline';
import replaceBetween from '../utils/replaceBetween';
import trimmedNodeRange from '../utils/trimmedNodeRange';

/**
 * Patches rest parameters.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
export function patchSwitchStart(node, patcher) {
  const { parentNode } = node;

  if (isExpressionlessSwitch(node)) {
    // e.g. `switch` by itself. we add '{' here because there's no expression to add it after in patchSwitchEnd.
    patcher.insert(node.range[0] + 'switch'.length, ' (false) {');
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.expression) {
    // e.g. `switch a` -> `switch (a`
    patcher.insert(node.range[0], '(');
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.alternate) {
    // e.g. `else` -> `default:`
    const lastCase = parentNode.cases[parentNode.cases.length - 1];
    replaceBetween(patcher, lastCase, node, 'else', 'default:');
  } else if (node.type === 'SwitchCase') {
    // e.g. `when a` -> `case a`
    const caseString = isExpressionlessSwitch(parentNode) ? 'case !(' : 'case ';
    patcher.overwrite(node.range[0], node.range[0] + 'when '.length, caseString);
  } else if (parentNode && parentNode.type === 'SwitchCase') {
    const conditionIndex = parentNode.conditions.indexOf(node);
    if (conditionIndex >= 1) {
      // e.g. in `when a, b` changes `, b` -> ` case b`
      const previousCondition = parentNode.conditions[conditionIndex - 1];
      const caseString = isExpressionlessSwitch(parentNode.parentNode) ? ' case !(' : ' case ';
      if (!replaceBetween(patcher, previousCondition, node, ', ', caseString)) {
        replaceBetween(patcher, previousCondition, node, ',', caseString);
      }
    } else if (conditionIndex < 0) {
      // `when` body
      if (!isMultiline(patcher.original, parentNode)) {
        // e.g. removes `then ` in `when a then b`
        replaceBetween(
          patcher,
          parentNode.conditions[parentNode.conditions.length - 1],
          node,
          'then ',
          ''
        );
      }
    }
  }
}

/**
 * Patches rest parameters.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */
export function patchSwitchEnd(node, patcher) {
  const { parentNode } = node;

  if (node.type === 'Switch') {
    // close the switch block
    appendClosingBrace(node, patcher);
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.expression) {
    // close the switch expression and start the switch block
    patcher.insert(node.range[1], ') {');
  } else if (parentNode && parentNode.type === 'Switch' && node === parentNode.alternate) {
    if (node.type !== 'Block') {
      // e.g. in `else a` adds `;` after `a`
      patcher.insert(node.range[1], ';');
    }
  } else if (parentNode && parentNode.type === 'SwitchCase') {
    const conditionIndex = parentNode.conditions.indexOf(node);
    if (conditionIndex >= 0) {
      // e.g. in `when a, b` adds `:` after `a` and `b`
      //      or, for expression-less switches, closes the negating parentheses too
      patcher.insert(node.range[1], isExpressionlessSwitch(parentNode.parentNode) ? '):' : ':');
    } else if (node === parentNode.consequent) {
      if (isMultiline(patcher.original, parentNode)) {
        if (!isImplicitlyReturned(node.statements[node.statements.length - 1])) {
          // adds `break;` on a new line
          let trimmedRange = trimmedNodeRange(node, patcher.original);
          patcher.insert(trimmedRange[1], `\n${adjustIndent(patcher.original, parentNode.range[0], 1)}break;`);
        }
      } else {
        // e.g. in `when a then b` adds `; break;` after `b`
        patcher.insert(node.range[1], isImplicitlyReturned(node) ? ';' : '; break;');
      }
    }
  }
}

/**
 * @param {Object} node
 * @returns {boolean}
 */
function isExpressionlessSwitch(node) {
  return node.type === 'Switch' && !node.expression;
}
