const Generator = require('./Generator')

function kopy(config) {
  return new Generator(config)
}

kopy.Generator = Generator

function setUtils(name, getUtil) {
  Object.defineProperty(kopy, name, {
    enumerable: true,
    configurable: true,
    get() {
      return getUtil()
    }
  })
}

setUtils('installPackages', () => require('./installPackages'))
setUtils('logger', () => require('./logger'))
setUtils('spinner', () => require('./spinner'))
setUtils('fs', () => require('majo').fs)
setUtils('handlError', () => Generator.handleError)

module.exports = kopy
