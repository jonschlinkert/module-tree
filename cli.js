#!/usr/bin/env node

var pkgTree = require('./');
var argv = require('minimist')(process.argv.slice(2), {
  alias: { p: 'patterns', c: 'color', v: 'version' }
});

var tree = pkgTree(argv.p, argv);
console.log(tree);
