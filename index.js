/*!
 * module-tree <https://github.com/jonschlinkert/module-tree>
 *
 * Copyright (c) 2016-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

/**
 * Module dependencies
 */

const fs = require('fs');
const path = require('path');
const archy = require('archy');
const typeOf = require('kind-of');
const define = require('define-property');
const get = require('get-value');
const set = require('set-value');
const stringify = require('stringify-keys');
const yellow = require('ansi-yellow');
const mm = require('micromatch');

/**
 * Build an object, where dependencies represented properties and
 * keys are module names.
 *
 * ```js
 * {
 *   'union-value': {
 *     'get-value': {
 *       pkg: [object] // package.json contents
 *     }
 *   }
 * }
 * ```
 * @name .buildTree
 * @param {Object} `pattern` Glob pattern to pass to [micromatch][] for filtering packages ([stringify-keys][] converts the object to an array of object paths, which is then filtered by micromatch)
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */

function buildTree(pattern, options) {
  const opts = createOptions(pattern, options);
  const pkg = require(path.resolve(opts.cwd, 'package.json'));
  pattern = opts.pattern;

  const cache = {
    tree: {},
    seen: {},
    missing: {},
    find: [],
    lookup: function(key) {
      return key && this.seen[key];
    }
  };

  cache.tree = { [pkg.name]: resolvePkg(cache, opts.cwd) };

  if (pattern) {
    const isMatch = mm.matcher(pattern);
    const result = {};

    for (const key of stringify(cache.tree)) {
      const segs = key.split('.');
      let name = segs.pop();

      if (isMatch(name)) {
        var val = get(cache.tree, key);
        if (opts.inclusive !== false) {
          set(result, key, val);
        }
        set(result, `${key}.pkg`, val.pkg);

        while (segs.length) {
          copyPkg(result, cache, segs.join('.'));
          segs.pop();
        }
      }
    }

    cache.tree = result;
  }

  return cache.tree;
}

function copyPkg(result, cache, name) {
  const val = get(cache.tree, name).pkg;
  if (val) {
    set(result, `${name}.pkg`, val);
  }
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

  function createNodes(leaf, opts) {
    const nodes = [];
    for (const key in leaf) {
      if (key === 'pkg') continue;
      const obj = {};
      const val = leaf[key];
      const pkg = val.pkg;
      if (!pkg) {
        throw new Error('cannot get package for: ' + key);
      }

      let suffix = opts.version ? '@' + pkg.version : '';
      if (opts.author) {
        const auth = author(pkg);
        suffix += auth ? ' (' + auth + ') ' : '';
      }
      obj.label = color(key + suffix, opts);
      obj.nodes = createNodes(val, opts);
      nodes.push(obj);
    }

    return nodes;
  }
  return createNodes(tree, options)[0];
}

function resolvePkg(cache, dir, cwd) {
  cwd = cwd || dir;
  const pkgPath = path.resolve(dir, 'package.json');
  const pkg = require(pkgPath);
  const tree = {};
  define(tree, 'pkg', pkg);
  resolveDeps(cache, cwd, pkg, tree);
  return tree;
}

function resolveDeps(cache, cwd, pkg, tree) {
  const keys = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDendencies || {}));

  keys.forEach(function(key) {
    const pkgPath = path.resolve(cwd, 'node_modules', key);
    if (!fs.existsSync(pkgPath)) {
      const fn = function(key) {
        return (tree[key] = cache.seen[key]);
      };
      cache.missing[key] = function(o) {
        tree[key] = o;
      };
      cache.find.push(fn);
      return;
    }

    if (!cache.seen.hasOwnProperty(key)) {
      cache.seen[key] = true;
      tree[key] = resolvePkg(cache, pkgPath, cwd);
    }
  });
}

function author(pkg) {
  if (typeOf(pkg.author) === 'object') {
    return pkg.author.name;
  }
  return pkg.author || '';
}

function color(key, options) {
  const col = options && options.color;
  switch (typeOf(col)) {
    case 'boolean':
      return col ? yellow(key) : key;
    case 'function':
      return col(key);
    case 'string':
      return mm.isMatch(key, col) ? yellow(key) : key;
    default: {
      return yellow(key);
    }
  }
}

function createOptions(pattern, options) {
  if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
    options = pattern || options;
    pattern = null;
  }

  const defaults = { pattern: pattern, cwd: process.cwd(), color: false };
  const opts = Object.assign({}, defaults, options);

  if (opts.pattern && !opts.color) {
    opts.color = opts.pattern;
  }
  return opts;
}

/**
 * Build a tree from module dependencies using [archy][].
 *
 * @param {Object} `pattern` Glob pattern to pass to [micromatch][] for filtering packages ([stringify-keys][] converts the object to an array of object paths, which is then filtered by micromatch)
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */

module.exports = function(pattern, options) {
  const opts = createOptions(pattern, options);
  const tree = buildTree(opts);
  const nodes = buildNodes(tree, opts);
  return archy(nodes);
};

/**
 * Expose `.buildTree`
 */

module.exports.buildTree = buildTree;

/**
 * Expose `.buildNodes`
 */

module.exports.buildNodes = buildNodes;
