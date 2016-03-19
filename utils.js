'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('define-property', 'define');
require('ansi-yellow', 'yellow');
require('glob-object', 'glob');
require('archy', 'archy');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
