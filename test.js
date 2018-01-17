'use strict';

require('mocha');
var assert = require('assert');
var tree = require('./');

describe('tree', function() {
  it('should create a tree and highlight the given module name', function() {
    assert(/\[33mmicromatch\[39m/.test(tree('micromatch')));
  });
});
