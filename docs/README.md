![kopy](https://user-images.githubusercontent.com/8784712/50736257-172d9100-11f6-11e9-9408-36bbceab2011.png)

_The backbone of a scaffolding tool._

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
