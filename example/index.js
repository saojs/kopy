const path = require('path')
const kopy = require('../lib')

const generator = kopy(require('./saofile'))

generator
  .run({ outDir: path.join(__dirname, 'dist'), injectAnswers: true })
  .catch(generator.handleError)
