const copy = require('.')

copy('../test/fixture-src', './')
  .then(files => {
    console.log(files)
  })
  .catch(err => console.log(err.stack))
