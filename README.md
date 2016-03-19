# module-tree [![NPM version](https://img.shields.io/npm/v/module-tree.svg)](https://www.npmjs.com/package/module-tree) [![Build Status](https://img.shields.io/travis/jonschlinkert/module-tree.svg)](https://travis-ci.org/jonschlinkert/module-tree)

> Create a visual tree of module dependencies using archy. Optionally pass a glob pattern to limit the result to names with that pattern, or a regex to selectively highlight package names.

## Install

Install globally with [npm](https://www.npmjs.com/)

```sh
$ npm install -g module-tree
```

## Usage

```sh
$ tree <options>
```

Results in a tree that looks something like:

```
module-tree
├─┬ ansi-yellow
│ └── ansi-wrap
├── archy
├─┬ define-property
│ └─┬ is-descriptor
│   ├─┬ is-accessor-descriptor
│   │ └─┬ kind-of
│   │   └── is-buffer
│   ├─┬ is-data-descriptor
│   │ └─┬ kind-of
│   │   └── is-buffer
│   ├─┬ kind-of
│   │ └── is-buffer
│   └── lazy-cache
...
```

## CLI options

* `--version` | `-v`: show versions next to package names (like npm's output when installing modules)
* `--pattern` | `-p`: glob pattern to pass to [glob-object](https://github.com/jonschlinkert/glob-object) for filtering packages by name. Visit [glob-object](https://github.com/jonschlinkert/glob-object) for usage instructions and available options.
* `--color` | `-c`: Add or remove color.

### --version

Show versions next to package names.

```sh
$ tree -v
```

Results in something like:

<img width="567" alt="screen shot 2016-03-19 at 4 21 51 am" src="https://cloud.githubusercontent.com/assets/383994/13897538/2d5fb252-ed8a-11e5-90ed-54804c2706a1.png">

### --color

**Remove color**

```sh
$ tree --color=false
# or
$ tree -c=false
```

**Add color**

Only apply coloring to packages that match the given regex pattern (make sure to wrap your pattern in quotes to ensure it's properly converted to regex):

```sh
# apply coloring to package names that begin with "is-"
$ tree -c="is-.*"
```

Results in something like:

<img width="566" alt="screen shot 2016-03-19 at 4 23 52 am" src="https://cloud.githubusercontent.com/assets/383994/13897550/8805dc36-ed8a-11e5-85e2-d843bd57d4a1.png">

## Example

When run in this project, the following command:

```sh
# remove color, filter package name "get-value"
$ tree -c=false -p="**.get-value"
```

Results in:

```js
{ label: 'module-tree',
  nodes:
   [ { label: 'glob-object',
       nodes: [ { label: 'get-value', nodes: [] } ] },
     { label: 'normalize-pkg',
       nodes:
        [ { label: 'map-schema',
            nodes:
             [ { label: 'get-value', nodes: [] },
               { label: 'union-value',
                 nodes: [ { label: 'get-value', nodes: [] } ] } ] } ] } ] }
```

Which renders to:

```
module-tree
├─┬ glob-object
│ └── get-value
└─┬ normalize-pkg
  └─┬ map-schema
    ├── get-value
    └─┬ union-value
      └── get-value
```

## API

The top level export is a function that will build a tree from the current project's package.json:

```js
var pkgTree = require('module-tree');
console.log(pkgTree());
```

Additionally, the following methods are exposed.

### [.buildTree](index.js#L32)

Build an object, where dependencies represented properties and keys are module names.

**Params**

* `patterns` **{Object}**: Glob pattern to pass to [glob-object](https://github.com/jonschlinkert/glob-object) for filtering packages.
* `options` **{Object}**
* `returns` **{Object}**

**Example**

```js
{
  'union-value': {
    'get-value': {}
  }
}
```

### [.buildNodes](index.js#L72)

Build an object that can be passed to [archy](https://github.com/substack/node-archy), where dependencies are represented as `nodes`, and the name of each package is used as the `label`.

**Params**

* `tree` **{Object}**
* `options` **{Object}**
* `returns` **{Object}**

**Example**

```js
// results in an object like this
{ label: 'union-value',
  nodes: [ { label: 'get-value', nodes: [] } ] }
```

Build a tree from module dependencies using [archy](https://github.com/substack/node-archy).

**Params**

* `patterns` **{String|Array}**: Glob patterns to pass to [glob-object](https://github.com/jonschlinkert/glob-object)
* `options` **{Object}**
* `returns` **{Object}**

## Related projects

[normalize-pkg](https://www.npmjs.com/package/normalize-pkg): Normalize values in package.json. | [homepage](https://github.com/jonschlinkert/normalize-pkg/)

## Generate docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/module-tree/issues/new).

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016 [Jon Schlinkert](https://github.com/jonschlinkert)
Released under the [MIT license](https://github.com/jonschlinkert/module-tree/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on March 19, 2016._