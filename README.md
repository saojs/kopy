# graceful-copy

[![NPM version](https://img.shields.io/npm/v/graceful-copy.svg?style=flat)](https://npmjs.com/package/graceful-copy) [![NPM downloads](https://img.shields.io/npm/dm/graceful-copy.svg?style=flat)](https://npmjs.com/package/graceful-copy) [![Build Status](https://img.shields.io/circleci/project/egoist/graceful-copy/master.svg?style=flat)](https://circleci.com/gh/egoist/graceful-copy)

> Gracefully copy a directory with templates.

## Why is this useful?

This could be used to build a scaffolding tool like [yeoman](https://github.com/yeoman/yeoman) or [vue-cli](https://github.com/vuejs/vue-cli).

## Install

```bash
$ npm install --save graceful-copy
```

## Usage

```js
const copy = require('graceful-copy')

copy('./template', './dest', {
  data: {
    foo: 'bar'
  }
}).then(files => {
  console.log(files) // array of filenames in './dest'
}).catch(err => {
  console.log(err.stack)
})
```

## Template Syntax

Templates could use [handlebars](http://handlebarsjs.com/) syntax or any template engine in [consolidate.js](https://github.com/tj/consolidate.js)

## API

### copy(src, dest, options)

#### src

Type: `string`<br>
Required: `true`

Source directory. Could be a relative or absolute path.

#### dest

Type: `string`<br>
Required: `true`

Destination directory.

#### options

##### engine

Type: `string`<br>
Default: `handlebars`

All template engines that're supported by [consolidate.js](https://github.com/tj/consolidate.js)

##### clean

Type: `boolean`<br>
Default: `true`

Whether to clean destination directory before writing to it.

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Current working directory.

##### data

Type: `object`<br>
Default: `{}`

The data to render templates in source directory.

##### skipInterpolation

Type: `string | Array<string> | function`<br>
Default: `undefined` (we skip all [binary files](https://github.com/sindresorhus/is-binary-path) by default)

Patterns([multimatch](https://github.com/sindresorhus/multimatch)) used to skip interpolation, eg: `./foo*/bar-*.js`

It could also be a function, whose first arg is file path and second arg is file content, eg. we want to exclude all `.js` files:

```js
copy(src, dest, {
  skipInterpolation(file, content) {
    return /\.js$/.test(file)
  }
})
```

**graceful-copy** © [EGOIST](https://github.com/egoist), Released under the [MIT](https://egoist.mit-license.org/) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/graceful-copy/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
