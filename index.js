/*!
 * module-tree (https://github.com/jonschlinkert/module-tree)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var util = require('util');
var path = require('path');
var utils = require('./utils');

/**
 * Build an object, where dependencies represented properties and
 * keys are module names.
 *
 * ```js
 * {
 *   'union-value': {
 *     'get-value': {}
 *   }
 * }
 * ```
 * @name .buildTree
 * @param {Object} `patterns` Glob pattern to pass to [glob-object][] for filtering packages.
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */

function buildTree(patterns, options) {
  if (typeof patterns !== 'string' && !Array.isArray(patterns)) {
    options = patterns;
    patterns = null;
  }

  options = options || {};
  var cwd = options.cwd || process.cwd();

  var pkg = require(path.resolve(cwd, 'package.json'));
  var obj = {};
  obj[pkg.name] = resolvePkg(cwd);

  if (patterns) {
    var filtered = utils.glob(patterns, obj);
    if (!Object.keys(filtered).length) {
      throw new Error('Cannot find a match for: ' + patterns);
    }
    return filtered;
  }
  return obj;
}

function resolvePkg(dir, cwd) {
  cwd = cwd || dir;
  var pkgPath = path.resolve(dir, 'package.json');
  var pkg = require(pkgPath);
  var deps = pkg.dependencies || {};
  var tree = {};
  utils.define(tree, 'pkg', pkg);
  for (var key in deps) {
    tree[key] = resolvePkg(path.resolve(cwd, 'node_modules', key), cwd);
  }
  return tree;
}

/**
 * Build an object that can be passed to [archy][], where dependencies
 * are represented as `nodes`, and the name of each package is used
 * as the `label`.
 *
 * ```js
 * // results in an object like this
 * { label: 'union-value',
 *   nodes: [ { label: 'get-value', nodes: [] } ] }
 * ```
 * @name .buildNodes
 * @param {Object} `tree`
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */

function buildNodes(tree, options) {
  options = options || {};

  function createNodes(t, opts) {
    var nodes = [];
    for (var key in t) {
      var obj = {};
      var val = t[key];
      var pkg = val.pkg;
      if (opts.version) {
        key += '@' + pkg.version;
      }
      obj.label = color(key, opts);
      obj.nodes = createNodes(val, opts);
      nodes.push(obj);
    }
    return nodes;
  }
  var res = createNodes(tree, options);
  return res[0];
}

function color(key, options) {
  options = options || {};
  if (typeof options.color === false) {
    return key;
  }
  if (typeof options.color === 'function') {
    return options.color(key);
  }
  if (typeof options.color === 'string') {
    var re = new RegExp(options.color);
    return re.test(key) ? utils.yellow(key) : key;
  }
  return utils.yellow(key);
}

/**
 * Build a tree from module dependencies using [archy][].
 *
 * @param {String|Array} `patterns` Glob patterns to pass to [glob-object][]
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */

module.exports = function(patterns, options) {
  var tree = buildTree(patterns, options);
  var nodes = buildNodes(tree, options);
  return utils.archy(nodes);
};

/**
 * Expose `.buildTree`
 */

module.exports.buildTree = buildTree;

/**
 * Expose `.buildNodes`
 */

module.exports.buildNodes = buildNodes;
