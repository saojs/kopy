const spawn = require('cross-spawn')

module.exports = (...args) =>
  new Promise((resolve, reject) => {
    const cp = spawn(...args)
    cp.on('error', reject)
    cp.on('close', () => {
      resolve(cp)
    })
  })
