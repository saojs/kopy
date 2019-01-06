const kopy = require('..')

test('simple', async () => {
  const generator = kopy({
    prompts: [
      {
        name: 'name',
        type: 'text',
        message: 'what is your name',
        initial: 'kevin'
      }
    ]
  })
  await generator.test()
  expect(generator.answers).toEqual({
    name: 'kevin'
  })
})
