# kopy

[![NPM version](https://img.shields.io/npm/v/kopy.svg?style=flat)](https://npmjs.com/package/kopy) [![NPM downloads](https://img.shields.io/npm/dm/kopy.svg?style=flat)](https://npmjs.com/package/kopy) [![Build Status](https://img.shields.io/circleci/project/saojs/kopy/master.svg?style=flat)](https://circleci.com/gh/saojs/kopy)

> Gracefully copy a directory and render templates.

## Why is this useful?

This could be used to build a scaffolding tool like [yeoman](https://github.com/yeoman/yeoman) or [vue-cli](https://github.com/vuejs/vue-cli), and it's actually used by [SAO](https://github.com/saojs/sao).

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

Returns a Promise resolving the [`majo`](https://github.com/egoist/majo) instance we use. 

```js
copy(...args)
  .then(stream => {
    // stream is a majo instance
    // answers for prompts (if any)
    stream.meta.answers
    // options.data basically
    stream.meta.data
    // merged 'answers' and 'data'
    stream.meta.merged
  })
```

#### src

Type: `string`<br>
Required: `true`

Source directory. Could be a relative or absolute path.

#### dest

Type: `string`<br>
Required: `true`

Destination directory.

#### options

##### glob

Type: `Array` `string`<br>
Default: `['**', '!**/node_modules/**']`

Use the glob pattern(s) to find files in `src` directory.

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

Type: `object` `function`

The template engine options.

If it's a function we use the return value as `templateOptions`, and the first argument is `{ answers, data, merged }`.

##### clean

Type: `boolean`<br>
Default: `false`

Whether to clean destination directory before writing to it.

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Current working directory.

##### data

Type: `object` `function`<br>
Default: `undefined`

The data to be used in rendering templates in source directory, filter files etc.

If it's a function, we use its return value as `data`, and the first arguments is `answers`.

##### prompts

Type: `Array<InquirerPrompt>`<br>
Default: `undefined`

[inquirer](https://github.com/SBoudrias/Inquirer.js) prompts, the answers of prompts will be assigned to `data`


##### mockPrompts

Type: `Object`

An object of mocked prompt values, eg:

```js
{
  prompts: [
    { name: 'foo', message: 'type foo', validate: v => v === 'foo' },
    { name: 'hey', message: 'type hey' }
  ],
  mockPrompts: {
    foo: 'bar'
  }
}
```

In the above case, we will not run prompts to get answers from users, instead we use set `foo`'s value to `bar` and validate it. And in this case it will throw since `'bar' !== 'foo'`. The value of `hey` would be `undefined`.

##### skipInterpolation

Type: `string | Array<string|function> | function`<br>
Default: `undefined` (we skip all [binary files](https://github.com/sindresorhus/is-binary-path) by default)

Patterns([minimatch](https://github.com/isaacs/minimatch#features)) used to skip interpolation, eg: `./foo*/bar-*.js`

It could also be a function, whose first arg is file path and second arg is file content, eg. we want to exclude all `.js` files:

```js
copy(src, dest, {
  skipInterpolation(file, stream) {
    return /\.js$/.test(file)
  }
})
```

##### disableInterpolation

Type: `boolean`<br>
Default: `false`

Similar to `skipInterpolation`, but `disableInterpolation` disables all template interpolation, template markup will remain the way it is.

##### filters

Type: `object` `function`<br>
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

If it's a function, the first argument of it would be the result of `data` merging with prompt answers.

##### move

Type: `object` `function`<br>
Default: `undefined`

Similar to `filters`, but instead of filtering files, it just renames the file:

```js
copy(src, dest, {
  move: {
    'gitignore': '.gitignore',
    'folder/file.js': 'another/file.ts'
  }
})
```

If it's a function, the first argument of it would be the result of `data` merging with prompt answers.

The value of each entry should be a file path or a function will returns a file path:

```js
copy(src, dest, {
  move: {
    'foo.*': 'foo.js',
    'bar-*.js': filepath => filepath.replace(/^bar-/, 'bar/')
  }
})
```

##### transforms

Type: `object`<br>
Default: `undefined`

Transform files in the way you like instead of rendering with specific template engine.

```js
copy(src, dest, {
  transforms: {
    // Transform JS files with babel
    '**/*.js'(relativePath, stream) {
      const contents = stream.fileContents(relativePath)
      const { code } = babel.transform(contents)
      stream.writeContents(relativePath, code)
    }
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

##### write

Type: `boolean`<br>
Default: `true`

Process files and write to disk.

### stream

The [majo](https://github.com/egoist/majo/blob/master/docs/api.md) instance.

#### stream.meta

##### stream.meta.answers

Prompts answers.

##### stream.meta.data

The `data` you passed from `options`.

##### stream.meta.merged

Merged `answers` and `data`.

---

**kopy** © [EGOIST](https://github.com/egoist), Released under the [MIT](https://egoist.mit-license.org/) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/kopy/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
