# module-tree [![NPM version](https://img.shields.io/npm/v/module-tree.svg?style=flat)](https://www.npmjs.com/package/module-tree) [![NPM monthly downloads](https://img.shields.io/npm/dm/module-tree.svg?style=flat)](https://npmjs.org/package/module-tree) [![NPM total downloads](https://img.shields.io/npm/dt/module-tree.svg?style=flat)](https://npmjs.org/package/module-tree) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/module-tree.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/module-tree)

> Create a visual tree of module dependencies using archy. Optionally pass a glob pattern to limit the result to names with that pattern, or a regex to selectively highlight package names.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install globally with [npm](https://www.npmjs.com/)

```sh
$ npm install --global module-tree
```

## Usage

```sh
$ mtree <options>
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
$ mtree -v
```

Results in something like:

<img width="567" alt="screen shot 2016-03-19 at 4 21 51 am" src="https://cloud.githubusercontent.com/assets/383994/13897538/2d5fb252-ed8a-11e5-90ed-54804c2706a1.png">

### --color

**Remove color**

```sh
$ mtree --color=false
# or
$ mtree -c=false
```

**Add color**

Only apply coloring to packages that match the given regex pattern (make sure to wrap your pattern in quotes to ensure it's properly converted to regex):

```sh
# apply coloring to package names that begin with "is-"
$ mtree -c="is-.*"
```

Results in something like:

<img width="566" alt="screen shot 2016-03-19 at 4 23 52 am" src="https://cloud.githubusercontent.com/assets/383994/13897550/8805dc36-ed8a-11e5-85e2-d843bd57d4a1.png">

## Example

When run in this project, the following command:

```sh
# remove color, filter package name "get-value"
$ mtree -c=false -p="**.get-value"
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

### [.buildTree](index.js#L45)

Build an object, where dependencies represented properties and keys are module names.

**Params**

* `pattern` **{Object}**: Glob pattern to pass to [micromatch](https://github.com/micromatch/micromatch) for filtering packages ([stringify-keys](https://github.com/doowb/stringify-keys) converts the object to an array of object paths, which is then filtered by micromatch)
* `options` **{Object}**
* `returns` **{Object}**

**Example**

```js
{
  'union-value': {
    'get-value': {
      pkg: [object] // package.json contents
    }
  }
}
```

### [.buildNodes](index.js#L114)

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

* `pattern` **{Object}**: Glob pattern to pass to [micromatch](https://github.com/micromatch/micromatch) for filtering packages ([stringify-keys](https://github.com/doowb/stringify-keys) converts the object to an array of object paths, which is then filtered by micromatch)
* `options` **{Object}**
* `returns` **{Object}**

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>
<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

[normalize-pkg](https://www.npmjs.com/package/normalize-pkg): Normalize values in package.json using the map-schema library. | [homepage](https://github.com/jonschlinkert/normalize-pkg "Normalize values in package.json using the map-schema library.")

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 14 | [jonschlinkert](https://github.com/jonschlinkert) |
| 4 | [akileez](https://github.com/akileez) |

### Author

**Jon Schlinkert**

* [linkedin/in/jonschlinkert](https://linkedin.com/in/jonschlinkert)
* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on January 17, 2018._