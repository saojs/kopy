# Testing Generators

```js
const kopy = require('kopy')

const config = {
  prompts: [
    {
      name: 'name',
      type: 'input',
      message: 'what is your name'
    }
  ]
}

test('it works', async () => {
  const generator = kopy(config)
  await generator.emulate()
  expect(generator.answers).toEqual({ name: '' })
})
```

## Generator Instance

Check out API reference for [Generator Instance](./generator.md).
