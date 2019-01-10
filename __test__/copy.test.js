const kopy = require('../lib')
const { fixture } = require('./utils')

describe('copy', () => {
  it('requires cwd', async () => {
    const generator = kopy({
      actions() {
        return [
          {
            type: 'copy',
            files: '**'
          }
        ]
      }
    })
    try {
      await generator.emulate()
    } catch (err) {
      expect(err.message).toMatch('"cwd" is required for "copy" action!')
    }
  })

  it('copies with glob patterns', async () => {
    const generator = kopy({
      actions() {
        return [
          {
            type: 'copy',
            files: '*.js',
            cwd: fixture('copy-glob')
          }
        ]
      }
    })
    await generator.emulate()
    expect(generator.fileList).toEqual(['foo.js'])
  })
})
