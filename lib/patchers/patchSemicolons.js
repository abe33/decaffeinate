'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patchSemicolons;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsFollowedBy = require('../utils/isFollowedBy');

var _utilsIsFollowedBy2 = _interopRequireDefault(_utilsIsFollowedBy);

var _utilsShouldHaveTrailingSemicolon = require('../utils/shouldHaveTrailingSemicolon');

var _utilsShouldHaveTrailingSemicolon2 = _interopRequireDefault(_utilsShouldHaveTrailingSemicolon);

var _utilsTrimmedNodeRange = require('../utils/trimmedNodeRange');

var _utilsTrimmedNodeRange2 = _interopRequireDefault(_utilsTrimmedNodeRange);

var _utilsTypes = require('../utils/types');

/**
 * Adds semicolons after statements that should have semicolons.
 *
 * @param {Object} node
 * @param {MagicString} patcher
 */

function patchSemicolons(node, patcher) {
  if ((0, _utilsShouldHaveTrailingSemicolon2['default'])(node) && !(0, _utilsTypes.isFunction)(node)) {
    if (!(0, _utilsIsFollowedBy2['default'])(node, patcher.original, ';')) {
      var nodeRange = (0, _utilsTrimmedNodeRange2['default'])(node, patcher.original);
      while (patcher.original[nodeRange[0]] === '(' && patcher.original[nodeRange[1]] === ')') {
        nodeRange[0]--;
        nodeRange[1]++;
      }
      patcher.insert(nodeRange[1], ';');
    }
  }
}

module.exports = exports['default'];