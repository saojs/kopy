const copy = require('.')

copy('../test/fixture-src', './', {
  prompts: [
    {
      type: 'confirm',
      message: 'hello?',
      name: 'has'
    }
  ]
})
  .then(files => {
    console.log(files)
  })
  .catch(err => console.log(err.stack))
