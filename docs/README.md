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
  // Ask some questions!
  prompts() {
    return [
      {
        type: 'text',
        name: 'name',
        message: 'what is your name'
      }
    ]
  },
  // Manipulate files with ease!
  actions() {
    return [
      // Copy files from `templates` directory to output directory
      {
        type: 'copy',
        // One or more glob patterns
        files: '**',
        cwd: '/path/to/templates',
        // When specified, transform the files with `ejs`
        data: this.answers
      }
    ]
  },
  // When we're done :)
  completed() {
    this.logger.success(`Generated into ${this.colors.underline(this.outDir)}`)
    // Or simply:
    // this.showSuccessTips()
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
  await generator.test({
    // Prompt answers
    name: 'kevin'
  })
  expect(generator.fileList).toContain('index.js')
})
```
