const path = require('path')

module.exports = {
  prompts() {
    return [
      {
        type: 'text',
        name: 'name',
        message: 'what is your name',
        cache: true
      }
    ]
  },
  actions() {
    return [
      {
        type: 'copy',
        files: '**',
        cwd: path.join(__dirname, 'templates'),
        data: this.answers
      },
      {
        type: 'modify',
        files: 'foo.txt',
        handler(data) {
          return data.replace('h', 'x')
        }
      },
      {
        type: 'move',
        patterns: {
          'fo*.txt': 'bar.txt'
        }
      }
    ]
  },
  async completed() {
    await this.npmInstall()
    await this.gitInit({ commit: true })
    this.logger.success('Done!')
  }
}
