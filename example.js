const copy = require('.')

copy('../test/fixture-src', './', {
  prompts: [
    {
      type: 'confirm',
      message: 'hello?',
      name: 'has'
    },
    {
      name: 'name',
      message: 'your name?'
    }
  ],
  skipExisting(file) {
    console.log(`${file} exists! skipped...`)
  }
})
  .then(res => {
    console.log(res)
  })
  .catch(err => console.log(err.stack))
