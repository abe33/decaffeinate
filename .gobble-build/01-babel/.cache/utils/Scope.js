'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _leftHandIdentifiers = require('./leftHandIdentifiers');

var _leftHandIdentifiers2 = _interopRequireDefault(_leftHandIdentifiers);

/**
 * Represents a CoffeeScript scope and its bindings.
 *
 * @param {?Scope} parent
 * @constructor
 */

var Scope = (function () {
  function Scope(parent) {
    _classCallCheck(this, Scope);

    this.parent = parent;
    this.bindings = Object.create(parent ? parent.bindings : null);
  }

  /**
   * @param {string} name
   * @returns {?Object}
   */

  _createClass(Scope, [{
    key: 'getBinding',
    value: function getBinding(name) {
      return this.bindings[this.key(name)] || null;
    }

    /**
     * @returns {string[]}
     */
  }, {
    key: 'getOwnNames',
    value: function getOwnNames() {
      var _this = this;

      return Object.getOwnPropertyNames(this.bindings).map(function (key) {
        return _this.unkey(key);
      });
    }

    /**
     * @param {string} name
     * @param {Object} node
     */
  }, {
    key: 'declares',
    value: function declares(name, node) {
      var key = this.key(name);
      this.bindings[key] = node;
    }

    /**
     * @param {string} name
     * @param {Object} node
     */
  }, {
    key: 'assigns',
    value: function assigns(name, node) {
      if (!this.bindings[this.key(name)]) {
        // Not defined in this or any parent scope.
        this.declares(name, node);
      }
    }

    /**
     * @param {string} name
     * @returns {string}
     * @private
     */
  }, {
    key: 'key',
    value: function key(name) {
      return '$' + name;
    }

    /**
     * @param {string} key
     * @returns {string}
     * @private
     */
  }, {
    key: 'unkey',
    value: function unkey(key) {
      return key.slice(1);
    }

    /**
     * Handles declarations or assigns for any bindings for a given node.
     *
     * @param {Object} node
     */
  }, {
    key: 'processNode',
    value: function processNode(node) {
      var _this2 = this;

      switch (node.type) {
        case 'AssignOp':
          (0, _leftHandIdentifiers2['default'])(node.assignee).forEach(function (identifier) {
            return _this2.assigns(identifier.data, identifier);
          });
          break;

        case 'Function':
        case 'BoundFunction':
          node.parameters.forEach(function (parameter) {
            return _this2.declares(parameter.data, parameter);
          });
          break;

        case 'ForIn':
        case 'ForOf':
          [node.keyAssignee, node.valAssignee].forEach(function (assignee) {
            if (assignee) {
              (0, _leftHandIdentifiers2['default'])(assignee).forEach(function (identifier) {
                return _this2.assigns(identifier.data, identifier);
              });
            }
          });
          break;
      }
    }

    /**
     * @returns {string}
     */
  }, {
    key: 'toString',
    value: function toString() {
      var parts = this.getOwnNames();
      if (this.parent) {
        parts.push('parent = ' + this.parent);
      }
      return this.constructor.name + ' {' + (parts.length > 0 ? ' ' + parts.join(', ') + ' ' : '') + '}';
    }

    /**
     * @returns {string}
     */
  }, {
    key: 'inspect',
    value: function inspect() {
      return this.toString();
    }
  }]);

  return Scope;
})();

exports['default'] = Scope;
module.exports = exports['default'];