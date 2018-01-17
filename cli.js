#!/usr/bin/env node

const pkgTree = require('./');
const options = require('minimist')(process.argv.slice(2), {
  boolean: ['inclusive'],
  default: {
    inclusive: true
  },
  alias: {
    i: 'inclusive',
    p: 'pattern',
    c: 'color',
    v: 'version',
    a: 'author'
  }
});

const res = pkgTree(options.pattern, options);
console.log(res);
