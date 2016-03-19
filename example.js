/*!
 * pkg-tree (https://github.com/jonschlinkert/pkg-tree)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var colors = require('ansi-colors');
var stripColor = require('strip-color');
var pkgTree = require('./');

var tree = pkgTree({
  name: 'assemble',
  regex: /^base/,
  highlight: highlight
});

function highlight(name, pkg) {
  if (pkg.author && pkg.author.name === 'Jon Schlinkert') {
    name = colors.magenta(name);
  } else {
    name = stripColor(name);
  }
  return name;
}

function highlight(name, pkg) {
  if (!/^base-/.test(name)) {
    return colors.gray(name);
  }
  return name;

  // function style(re, color) {
  //   if (re.test(name)) {
  //     name = colors[color](name);
  //   }
  // }
  // style(/^assemble/, 'cyan');
  // style(/^base/, 'magenta');
  // style(/^ansi-/, 'green');
  // style(/^lodash/, 'blue');
  // return name;
}

console.log(tree);
