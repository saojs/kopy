const kopy = require('../lib')

test('simple', async () => {
  const generator = kopy({
    prompts: [
      {
        name: 'name',
        message: 'what is your name',
        default: 'kevin'
      },
      {
        name: 'gender',
        message: 'select your gender',
        choices: ['male', 'female'],
        initial: 'female'
      }
    ]
  })
  await generator.emulate()
  expect(generator.answers).toEqual({
    name: 'kevin',
    gender: 'female'
  })
})
