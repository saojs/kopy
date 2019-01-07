<br><br><br><br><br><br><br>

![kopy 1](https://user-images.githubusercontent.com/8784712/50736257-172d9100-11f6-11e9-9408-36bbceab2011.png)

<br><br><br><br><br><br><br>

[![NPM version](https://badgen.net/npm/v/kopy)](https://npmjs.com/package/kopy) [![NPM downloads](https://badgen.net/npm/dm/kopy)](https://npmjs.com/package/kopy) [![CircleCI](https://badgen.net/circleci/github/saojs/kopy/master)](https://circleci.com/gh/saojs/kopy/tree/master) [![package size](https://badgen.net/packagephobia/install/kopy)](https://packagephobia.now.sh/result?p=kopy) [![donate](https://badgen.net/badge/support%20me/donate/ff69b4)](https://patreon.com/egoist) [![chat](https://badgen.net/badge/chat%20on/discord/7289DA)](https://chat.egoist.moe)

---

**The backbone of a scaffolding tool.**

## Features

- Zero-dependency, very light-weight (940KB) compared to [Yeoman](https://packagephobia.now.sh/result?p=yeoman-generator) (12MB)
- Ultra-simple, this module exists because writing Yeoman generator is hard and time-consuming

## Install

```bash
yarn add kopy
```

## Usage

```js
const kopy = require('kopy')

const config = {
  prompts() {
    return [
      {
        type: 'text',
        name: 'name',
        message: 'what is your name'
      }
    ]
  },
  actions() {
    return [
      {
        type: 'copy',
        files: '**',
        cwd: '/path/to/templates',
        // When specified, transform the files with `ejs`
        data: this.answers
      }
    ]
  },
  completed() {
    console.log('Done!')
  }
}

const generator = kopy(config)

generator
  .run({
    outDir: './out'
  })
  .catch(generator.handleError)
```

Testing:

```js
const kopy = require('kopy')

test('it works', async () => {
  const generator = kopy(config)
  const result = await generator.test({
    name: 'kevin'
  })
  expect(result.fileList).toContain('index.js')
})
```

**Read more docs on [our website](https://kopy.saojs.org).**

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**kopy** © EGOIST, Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/saojs/kopy/contributors)).

> [Website](https://egoist.sh) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@\_egoistlily](https://twitter.com/_egoistlily)
