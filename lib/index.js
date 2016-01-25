'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.convert = convert;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _magicString = require('magic-string');

var _magicString2 = _interopRequireDefault(_magicString);

var _utilsParse = require('./utils/parse');

var _utilsParse2 = _interopRequireDefault(_utilsParse);

var _patchersPatchCommas = require('./patchers/patchCommas');

var _patchersPatchCommas2 = _interopRequireDefault(_patchersPatchCommas);

var _patchersPatchComments = require('./patchers/patchComments');

var _patchersPatchComments2 = _interopRequireDefault(_patchersPatchComments);

var _patchersPatchDeclarations = require('./patchers/patchDeclarations');

var _patchersPatchDeclarations2 = _interopRequireDefault(_patchersPatchDeclarations);

var _patchersPatchEmbeddedJavaScript = require('./patchers/patchEmbeddedJavaScript');

var _patchersPatchEmbeddedJavaScript2 = _interopRequireDefault(_patchersPatchEmbeddedJavaScript);

var _patchersPatchEquality = require('./patchers/patchEquality');

var _patchersPatchEquality2 = _interopRequireDefault(_patchersPatchEquality);

var _patchersPatchKeywords = require('./patchers/patchKeywords');

var _patchersPatchKeywords2 = _interopRequireDefault(_patchersPatchKeywords);

var _patchersPatchOf = require('./patchers/patchOf');

var _patchersPatchOf2 = _interopRequireDefault(_patchersPatchOf);

var _patchersPatchPrototypeAccess = require('./patchers/patchPrototypeAccess');

var _patchersPatchPrototypeAccess2 = _interopRequireDefault(_patchersPatchPrototypeAccess);

var _patchersPatchRegularExpressions = require('./patchers/patchRegularExpressions');

var _patchersPatchRegularExpressions2 = _interopRequireDefault(_patchersPatchRegularExpressions);

var _patchersPatchReturns = require('./patchers/patchReturns');

var _patchersPatchReturns2 = _interopRequireDefault(_patchersPatchReturns);

var _patchersPatchSemicolons = require('./patchers/patchSemicolons');

var _patchersPatchSemicolons2 = _interopRequireDefault(_patchersPatchSemicolons);

var _patchersPatchSequences = require('./patchers/patchSequences');

var _patchersPatchSequences2 = _interopRequireDefault(_patchersPatchSequences);

var _patchersPatchStringInterpolation = require('./patchers/patchStringInterpolation');

var _patchersPatchStringInterpolation2 = _interopRequireDefault(_patchersPatchStringInterpolation);

var _patchersPatchThis = require('./patchers/patchThis');

var _patchersPatchThis2 = _interopRequireDefault(_patchersPatchThis);

var _preprocessorsPreprocessBinaryExistentialOperator = require('./preprocessors/preprocessBinaryExistentialOperator');

var _preprocessorsPreprocessBinaryExistentialOperator2 = _interopRequireDefault(_preprocessorsPreprocessBinaryExistentialOperator);

var _preprocessorsPreprocessChainedComparison = require('./preprocessors/preprocessChainedComparison');

var _preprocessorsPreprocessChainedComparison2 = _interopRequireDefault(_preprocessorsPreprocessChainedComparison);

var _preprocessorsPreprocessClass = require('./preprocessors/preprocessClass');

var _preprocessorsPreprocessClass2 = _interopRequireDefault(_preprocessorsPreprocessClass);

var _preprocessorsPreprocessCompoundAssignment = require('./preprocessors/preprocessCompoundAssignment');

var _preprocessorsPreprocessCompoundAssignment2 = _interopRequireDefault(_preprocessorsPreprocessCompoundAssignment);

var _preprocessorsPreprocessConditional = require('./preprocessors/preprocessConditional');

var _preprocessorsPreprocessConditional2 = _interopRequireDefault(_preprocessorsPreprocessConditional);

var _preprocessorsPreprocessDo = require('./preprocessors/preprocessDo');

var _preprocessorsPreprocessDo2 = _interopRequireDefault(_preprocessorsPreprocessDo);

var _preprocessorsPreprocessFor = require('./preprocessors/preprocessFor');

var _preprocessorsPreprocessFor2 = _interopRequireDefault(_preprocessorsPreprocessFor);

var _preprocessorsPreprocessIn = require('./preprocessors/preprocessIn');

var _preprocessorsPreprocessIn2 = _interopRequireDefault(_preprocessorsPreprocessIn);

var _preprocessorsPreprocessNegatableOps = require('./preprocessors/preprocessNegatableOps');

var _preprocessorsPreprocessNegatableOps2 = _interopRequireDefault(_preprocessorsPreprocessNegatableOps);

var _preprocessorsPreprocessParameters = require('./preprocessors/preprocessParameters');

var _preprocessorsPreprocessParameters2 = _interopRequireDefault(_preprocessorsPreprocessParameters);

var _preprocessorsPreprocessRange = require('./preprocessors/preprocessRange');

var _preprocessorsPreprocessRange2 = _interopRequireDefault(_preprocessorsPreprocessRange);

var _preprocessorsPreprocessSoakedMemberAccessOp = require('./preprocessors/preprocessSoakedMemberAccessOp');

var _preprocessorsPreprocessSoakedMemberAccessOp2 = _interopRequireDefault(_preprocessorsPreprocessSoakedMemberAccessOp);

var _preprocessorsPreprocessSoakedFunctionApplication = require('./preprocessors/preprocessSoakedFunctionApplication');

var _preprocessorsPreprocessSoakedFunctionApplication2 = _interopRequireDefault(_preprocessorsPreprocessSoakedFunctionApplication);

var _preprocessorsPreprocessSwitch = require('./preprocessors/preprocessSwitch');

var _preprocessorsPreprocessSwitch2 = _interopRequireDefault(_preprocessorsPreprocessSwitch);

var _preprocessorsPreprocessTry = require('./preprocessors/preprocessTry');

var _preprocessorsPreprocessTry2 = _interopRequireDefault(_preprocessorsPreprocessTry);

var _preprocessorsPreprocessWhile = require('./preprocessors/preprocessWhile');

var _preprocessorsPreprocessWhile2 = _interopRequireDefault(_preprocessorsPreprocessWhile);

var _utilsTraverse = require('./utils/traverse');

var _utilsTraverse2 = _interopRequireDefault(_utilsTraverse);

var _patchersPatchCalls = require('./patchers/patchCalls');

var _patchersPatchClass = require('./patchers/patchClass');

var _patchersPatchConditional = require('./patchers/patchConditional');

var _patchersPatchExistentialOperator = require('./patchers/patchExistentialOperator');

var _patchersPatchFor = require('./patchers/patchFor');

var _patchersPatchFunctions = require('./patchers/patchFunctions');

var _patchersPatchObjectBraces = require('./patchers/patchObjectBraces');

var _patchersPatchRest = require('./patchers/patchRest');

var _patchersPatchSlice = require('./patchers/patchSlice');

var _patchersPatchSpread = require('./patchers/patchSpread');

var _patchersPatchSwitch = require('./patchers/patchSwitch');

var _patchersPatchThrow = require('./patchers/patchThrow');

var _patchersPatchTry = require('./patchers/patchTry');

var _patchersPatchWhile = require('./patchers/patchWhile');

/**
 * Decaffeinate CoffeeScript source code by adding optional punctuation.
 *
 * @param source
 * @returns {string}
 */

function convert(_x) {
  var _again = true;

  _function: while (_again) {
    var source = _x;
    _again = false;

    var ast = (0, _utilsParse2['default'])(source);
    var patcher = new _magicString2['default'](source);

    var wasRewritten = false;

    (0, _utilsTraverse2['default'])(ast, function (node) {
      if (wasRewritten) {
        return false;
      }
      wasRewritten = (0, _preprocessorsPreprocessClass2['default'])(node, patcher) || (0, _preprocessorsPreprocessCompoundAssignment2['default'])(node, patcher) || (0, _preprocessorsPreprocessFor2['default'])(node, patcher) || (0, _preprocessorsPreprocessIn2['default'])(node, patcher) || (0, _preprocessorsPreprocessNegatableOps2['default'])(node, patcher) || (0, _preprocessorsPreprocessDo2['default'])(node, patcher) || (0, _preprocessorsPreprocessConditional2['default'])(node, patcher) || (0, _preprocessorsPreprocessBinaryExistentialOperator2['default'])(node, patcher) || (0, _preprocessorsPreprocessParameters2['default'])(node, patcher) || (0, _preprocessorsPreprocessRange2['default'])(node, patcher) || (0, _preprocessorsPreprocessSwitch2['default'])(node, patcher) || (0, _preprocessorsPreprocessSoakedFunctionApplication2['default'])(node, patcher) || (0, _preprocessorsPreprocessSoakedMemberAccessOp2['default'])(node, patcher) || (0, _preprocessorsPreprocessTry2['default'])(node, patcher) || (0, _preprocessorsPreprocessWhile2['default'])(node, patcher) || (0, _preprocessorsPreprocessChainedComparison2['default'])(node, patcher);
    });

    if (wasRewritten) {
      _x = patcher.toString();
      _again = true;
      ast = patcher = wasRewritten = undefined;
      continue _function;
    }

    (0, _utilsTraverse2['default'])(ast, function (node, descend) {
      (0, _patchersPatchConditional.patchConditionalStart)(node, patcher);
      (0, _patchersPatchWhile.patchWhileStart)(node, patcher);
      (0, _patchersPatchRegularExpressions2['default'])(node, patcher);
      (0, _patchersPatchReturns2['default'])(node, patcher);
      (0, _patchersPatchOf2['default'])(node, patcher);
      (0, _patchersPatchKeywords2['default'])(node, patcher);
      (0, _patchersPatchThis2['default'])(node, patcher);
      (0, _patchersPatchPrototypeAccess2['default'])(node, patcher);
      (0, _patchersPatchStringInterpolation2['default'])(node, patcher);
      (0, _patchersPatchFor.patchForStart)(node, patcher);
      (0, _patchersPatchSlice.patchSliceStart)(node, patcher);
      (0, _patchersPatchCalls.patchCallOpening)(node, patcher);
      (0, _patchersPatchObjectBraces.patchObjectBraceOpening)(node, patcher);
      (0, _patchersPatchDeclarations2['default'])(node, patcher);
      (0, _patchersPatchFunctions.patchFunctionStart)(node, patcher);
      (0, _patchersPatchClass.patchClassStart)(node, patcher);
      (0, _patchersPatchEquality2['default'])(node, patcher);
      (0, _patchersPatchThrow.patchThrowStart)(node, patcher);
      (0, _patchersPatchSpread.patchSpreadStart)(node, patcher);
      (0, _patchersPatchSwitch.patchSwitchStart)(node, patcher);
      (0, _patchersPatchRest.patchRestStart)(node, patcher);
      (0, _patchersPatchTry.patchTryStart)(node, patcher);
      (0, _patchersPatchEmbeddedJavaScript2['default'])(node, patcher);
      (0, _patchersPatchExistentialOperator.patchExistentialOperatorStart)(node, patcher);

      descend(node);

      (0, _patchersPatchTry.patchTryEnd)(node, patcher);
      (0, _patchersPatchWhile.patchWhileEnd)(node, patcher);
      (0, _patchersPatchThrow.patchThrowEnd)(node, patcher);
      (0, _patchersPatchExistentialOperator.patchExistentialOperatorEnd)(node, patcher);
      (0, _patchersPatchFunctions.patchFunctionEnd)(node, patcher);
      (0, _patchersPatchClass.patchClassEnd)(node, patcher);
      (0, _patchersPatchFor.patchForEnd)(node, patcher);
      (0, _patchersPatchObjectBraces.patchObjectBraceClosing)(node, patcher);
      (0, _patchersPatchConditional.patchConditionalEnd)(node, patcher);
      (0, _patchersPatchSlice.patchSliceEnd)(node, patcher);
      (0, _patchersPatchCalls.patchCallClosing)(node, patcher);
      (0, _patchersPatchSemicolons2['default'])(node, patcher);
      (0, _patchersPatchSequences2['default'])(node, patcher);
      (0, _patchersPatchCommas2['default'])(node, patcher);
      (0, _patchersPatchSpread.patchSpreadEnd)(node, patcher);
      (0, _patchersPatchSwitch.patchSwitchEnd)(node, patcher);
      (0, _patchersPatchRest.patchRestEnd)(node, patcher);
    });

    (0, _patchersPatchComments2['default'])(patcher);

    return patcher.toString();
  }
}