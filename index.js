/*!
 * pkg-tree (https://github.com/jonschlinkert/pkg-tree)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var yellow = require('ansi-yellow');
var archy = require('archy');
var hasGlob = require('has-glob');
var get = require('get-value');
var define = require('define-property');
var stringify = require('stringify-keys');
var glob = require('glob-object');

function find(dir, cwd) {
  cwd = cwd || dir;
  var pkgPath = path.resolve(dir, 'package.json');
  var pkg = require(pkgPath);
  var deps = pkg.dependencies || {};
  var tree = {};
  define(tree, 'pkg', pkg);

  for (var key in deps) {
    tree[key] = find(path.resolve(cwd, 'node_modules', key), cwd);
  }
  return tree;
}

function buildTree(patterns, options) {
  if (typeof patterns !== 'string' && !Array.isArray(patterns)) {
    options = patterns;
    patterns = null;
  }

  options = options || {};
  var cwd = options.cwd || process.cwd();

  var pkg = require(path.resolve(cwd, 'package.json'));
  var obj = {};
  obj[pkg.name] = find(cwd);

  if (patterns) {
    var filtered = glob(patterns, obj);
    if (!Object.keys(filtered).length) {
      throw new Error('Cannot find a match for: ' + patterns);
    }
    return filtered;
  }
  return obj;
}

function buildNodes(tree, options) {
  options = options || {};
  var nodes = [];
  for (var key in tree) {
    var obj = {};
    var val = tree[key];

    if (options.has && !isMatch(val.pkg, options.has)) {
      continue;
    }

    obj.label = highlight(key, options);
    obj.nodes = buildNodes(val, options);
    nodes.push(obj);
  }
  return nodes;
}

function isMatch(pkg, obj) {
  if (typeof obj.key === 'undefined') {
    return true;
  }

  return true;

  // var val = get(pkg, obj.key);

  // if (get(pkg, obj.key) !== obj.val) {
  //   continue;
  // }
}

function highlight(key, options) {
  options = options || {};
  if (typeof options.highlight === 'function') {
    return options.highlight(key);
  }
  if (typeof options.highlight === 'string') {
    var re = new RegExp(options.highlight);
    return re.test(key) ? yellow(key) : key;
  }
  return key;
}

module.exports = function(patterns, options) {
  var tree = buildTree(patterns, options);
  var nodes = buildNodes(tree, options)[0];
  return archy(nodes);
};

module.exports.json = buildTree;
