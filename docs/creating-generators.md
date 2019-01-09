# Creating Generators

```js
const kopy = require('kopy')

const config = {
  prompts() {
    return [
      {
        type: 'input',
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

## Config

Check out API reference for [Config](./config.md).

## Generator Instance

Check out API reference for [Generator Instance](./generator.md).
