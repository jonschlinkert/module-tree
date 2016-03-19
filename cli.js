#!/usr/bin/env node

var colors = require('ansi-colors');
var stripColor = require('strip-color');
var pkgTree = require('./');
var argv = require('minimist')(process.argv.slice(2), {
  alias: { p: 'patterns', h: 'highlight' }
});

console.log(argv.has);

if (argv.has) {
  var has = {};
  has.key = Object.keys(argv.has)[0];
  has.val = argv.has[has.key];
  argv.has = has;
}

var tree = pkgTree(argv.p, argv);
// console.log(tree.trim());
