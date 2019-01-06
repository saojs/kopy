# Testing Generators

```js
const kopy = require('kopy')

const config = {
  prompts: [
    {
      name: 'name',
      type: 'text',
      message: 'what is your name'
    }
  ]
}

test('it works', async () => {
  const generator = kopy(config)
  const answers = {
    name: 'kevin'
  }
  await generator.test(answers)
  expect(generator.fileList).toContain('index.js')
})
```

## Generator Instance

Check out API reference for [Generator Instance](./generator.md).
