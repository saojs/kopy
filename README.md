# kopy

[![NPM version](https://img.shields.io/npm/v/kopy.svg?style=flat)](https://npmjs.com/package/kopy) [![NPM downloads](https://img.shields.io/npm/dm/kopy.svg?style=flat)](https://npmjs.com/package/kopy) [![Build Status](https://img.shields.io/circleci/project/egoist/kopy/master.svg?style=flat)](https://circleci.com/gh/egoist/kopy)

> Gracefully copy a directory and render templates.

## Why is this useful?

This could be used to build a scaffolding tool like [yeoman](https://github.com/yeoman/yeoman) or [vue-cli](https://github.com/vuejs/vue-cli).

## Install

```bash
$ npm install --save kopy
```

## Usage

```js
const copy = require('kopy')

copy('./template', './dest', {
  data: {
    foo: 'bar'
  }
}).then(({files}) => {
  console.log(files) // array of filenames in './dest'
}).catch(err => {
  console.log(err.stack)
})
```

## Template Syntax

Templates could use [ejs](http://ejs.co) syntax or any template engine supported by [jstransformer](https://github.com/jstransformers)

## API

### copy(src, dest, options)

Returns a Promise which resolve `{files, data, answers, merged}`, `merged` is the result of answers of `answers` merged with `data`.

#### src

Type: `string`<br>
Required: `true`

Source directory. Could be a relative or absolute path.

#### dest

Type: `string`<br>
Required: `true`

Destination directory.

#### options

##### template

Type: `object`<br>
Default: `require('jstransformer-ejs')`

You can use a custom template engine, like [handlebars]:

```js
copy(src, dest, {
  template: require('jstransformer-handlebars')
})
```

##### templateOptions

Type: `object`

The template engine options.

##### clean

Type: `boolean`<br>
Default: `false`

Whether to clean destination directory before writing to it.

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Current working directory.

##### data

Type: `object`<br>
Default: `undefined`

The data to render templates in source directory.

##### prompts

Type: `Array<InquirerPrompt>`<br>
Default: `undefined`

[inquirer](https://github.com/SBoudrias/Inquirer.js) prompts, the answers of prompts will be assigned to `data`


##### skipInterpolation

Type: `string | Array<string> | function`<br>
Default: `undefined` (we skip all [binary files](https://github.com/sindresorhus/is-binary-path) by default)

Patterns([minimatch](https://github.com/isaacs/minimatch#features)) used to skip interpolation, eg: `./foo*/bar-*.js`

It could also be a function, whose first arg is file path and second arg is file content, eg. we want to exclude all `.js` files:

```js
copy(src, dest, {
  skipInterpolation(file, content) {
    return /\.js$/.test(file)
  }
})
```

##### disableInterpolation

Type: `boolean`<br>
Default: `false`

Similar to `skipInterpolation`, but `disableInterpolation` disables all template interpolation, template markup will remain the way it is.

##### filters

Type: `object`<br>
Default: `undefined`

An object containing file filter rules, the key of each entry is a minimatch pattern, and its value is a JavaScript expression evaluated in the context of (prompt answers) data:

```js
copy(src, dest, {
  filters: {
    '**/*.js': 'useJavaScript',
    '**/*.ts': '!useJavaScript'
  }
})
```

##### move

Type: `object`<br>
Default: `undefined`

Similar to `filters`, but instead of filtering files, it just renames the file:

```js
copt(src, dest, {
  move: {
    'gitignore': '.gitignore',
    'folder/file.js': 'another/file.ts'
  }
})
```

##### skipExisting

Type: `function` `boolean`<br>
Default: `undefined`

Whether to skip existing file, it could be function that takes the path to existing file as argument.

```js
copy(src, dest, {
  skipExisting(file) {
    console.log(`${file} exists, skipped!`)
  }
})
```

---

**kopy** © [EGOIST](https://github.com/egoist), Released under the [MIT](https://egoist.mit-license.org/) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/kopy/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
