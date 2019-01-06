const os = require('os')
const path = require('path')
const ini = require('ini')
const { fs } = require('majo')

let gitInfo = null

module.exports = mock => {
  if (gitInfo) return gitInfo

  if (mock) {
    return {
      name: 'MOCK_NAME',
      username: 'MOCK_USERNAME',
      email: 'mock@example.com'
    }
  }

  const filepath = path.join(os.homedir(), '.gitconfig')
  if (!fs.existsSync(filepath)) {
    return { name: '', username: '', email: '' }
  }
  const { user = {} } = ini.parse(fs.readFileSync(filepath, 'utf8'))
  gitInfo = {
    name: user.name || '',
    username: user.username || '',
    email: user.email || ''
  }
  return gitInfo
}
