const path = require('path')

exports.fixture = name => {
  return path.join(__dirname, 'fixtures', name)
}
