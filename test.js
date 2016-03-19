'use strict';

require('mocha');
var assert = require('assert');
var tree = require('./');

describe('tree', function() {
  it('should export a function', function() {
    assert.equal(typeof tree, 'function');
  });
});
