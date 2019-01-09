const kopy = require('../lib')

test('simple', async () => {
  const generator = kopy({
    prompts: [
      {
        name: 'name',
        type: 'input',
        message: 'what is your name',
        initial: 'kevin'
      }
    ]
  })
  await generator.emulate()
  expect(generator.answers).toEqual({
    name: 'kevin'
  })
})
