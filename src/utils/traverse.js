/**
 * Traverses an AST node, calling a callback for each node in the hierarchy in
 * source order.
 *
 * @param {Object} node
 * @param {function(Object, function(Object), boolean): ?boolean} callback
 */
export default function traverse(node, callback) {
  var descended = false;

  function descend(parent) {
    descended = true;

    childPropertyNames(parent).forEach(property => {
      const value = parent[property];
      if (Array.isArray(value)) {
        value.forEach(child => {
          child.parentNode = parent;
          traverse(child, callback);
        });
      } else if (value) {
        value.parentNode = parent;
        traverse(value, callback);
      }
    });
  }

  const shouldDescend = callback(
    node,
    descend,
    childPropertyNames(node).length === 0
  );

  if (!descended && shouldDescend !== false) {
    descend(node);
  }
}

const ORDER = {
  ArrayInitialiser: ['members'],
  AssignOp: ['assignee', 'expression'],
  BitAndOp: ['left', 'right'],
  BitNotOp: ['expression'],
  BitOrOp: ['left', 'right'],
  BitXorOp: ['left', 'right'],
  Block: ['statements'],
  Bool: [],
  BoundFunction: ['parameters', 'body'],
  Break: [],
  ChainedComparisonOp: ['expression'],
  Class: ['nameAssignee', 'parent', 'body'],
  ClassProtoAssignOp: ['assignee', 'expression'],
  CompoundAssignOp: ['assignee', 'expression'],
  ConcatOp: ['left', 'right'],
  Conditional: ['condition', 'consequent', 'alternate'],
  Constructor: ['expression'],
  Continue: [],
  DeleteOp: ['expression'],
  DivideOp: ['left', 'right'],
  DoOp: ['expression'],
  DefaultParam: ['param', 'default'],
  DynamicMemberAccessOp: ['expression', 'indexingExpr'],
  EQOp: ['left', 'right'],
  ExistsOp: ['left', 'right'],
  Float: [],
  ForIn: ['keyAssignee', 'valAssignee', 'target', 'step', 'filter', 'body'],
  ForOf: ['keyAssignee', 'valAssignee', 'target', 'filter', 'body'],
  Function: ['parameters', 'body'],
  FunctionApplication: ['function', 'arguments'],
  GTEOp: ['left', 'right'],
  GTOp: ['left', 'right'],
  Identifier: [],
  InOp: ['left', 'right'],
  InstanceofOp: ['left', 'right'],
  Int: [],
  JavaScript: [],
  LTEOp: ['left', 'right'],
  LTOp: ['left', 'right'],
  LeftShiftOp: ['left', 'right'],
  LogicalAndOp: ['left', 'right'],
  LogicalNotOp: ['expression'],
  LogicalOrOp: ['left', 'right'],
  MemberAccessOp: ['expression'],
  MultiplyOp: ['left', 'right'],
  NEQOp: ['left', 'right'],
  NewOp: ['ctor', 'arguments'],
  Null: [],
  ObjectInitialiser: ['members'],
  ObjectInitialiserMember: ['key', 'expression'],
  OfOp: ['left', 'right'],
  PlusOp: ['left', 'right'],
  PostDecrementOp: ['expression'],
  PostIncrementOp: ['expression'],
  PreDecrementOp: ['expression'],
  PreIncrementOp: ['expression'],
  Program: ['body'],
  ProtoMemberAccessOp: ['expression'],
  Range: ['left', 'right'],
  RegExp: [],
  HeregExp: [],
  RemOp: ['left', 'right'],
  Rest: ['expression'],
  Return: ['expression'],
  SeqOp: ['left', 'right'],
  SignedRightShiftOp: ['left', 'right'],
  Slice: ['expression', 'left', 'right'],
  SoakedDynamicMemberAccessOp: ['expression', 'indexingExpr'],
  SoakedFunctionApplication: ['function', 'arguments'],
  SoakedMemberAccessOp: ['expression'],
  Spread: ['expression'],
  String: [],
  SubtractOp: ['left', 'right'],
  Switch: ['expression', 'cases', 'alternate'],
  SwitchCase: ['conditions', 'consequent'],
  This: [],
  Throw: ['expression'],
  Try: ['body', 'catchAssignee', 'catchBody', 'finallyBody'],
  TypeofOp: ['expression'],
  UnaryExistsOp: ['expression'],
  UnaryNegateOp: ['expression'],
  UnaryPlusOp: ['expression'],
  Undefined: [],
  UnsignedRightShiftOp: ['left', 'right'],
  While: ['condition', 'body']
};

/**
 * @param {Object} node
 * @returns {string[]}
 */
function childPropertyNames(node) {
  const names = ORDER[node.type];

  if (!names) {
    throw new Error('cannot traverse unknown node type: ' + node.type);
  }

  return names;
}
