# graceful-copy

[![NPM version](https://img.shields.io/npm/v/graceful-copy.svg?style=flat-square)](https://npmjs.com/package/graceful-copy) [![NPM downloads](https://img.shields.io/npm/dm/graceful-copy.svg?style=flat-square)](https://npmjs.com/package/graceful-copy) [![Build Status](https://img.shields.io/circleci/project/egoist/graceful-copy/master.svg?style=flat-square)](https://circleci.com/gh/egoist/graceful-copy)

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

## Templates

Templates could use [handlebars](http://handlebarsjs.com/) syntax.

## API

### copy(src, dest, options)

#### src: string

Source directory. Could be a relative or absolute path.

#### dest: string

Destination directory.

### options: object

#### clean: boolean

Whether to clean destination directory before writing to it. Defaults to `true`.

#### cwd: string

Current working directory. Defaults to `process.cwd()`.

#### data: object

The data to render templates in source directory.

#### skipInterpolation: string | string[]

Patterns used to skip interpolation, eg: `./foo*/bar-*.js`

---

**graceful-copy** © [EGOIST](https://github.com/egoist), Released under the [MIT](https://egoist.mit-license.org/) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/graceful-copy/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
