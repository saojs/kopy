const path = require('path')
const majo = require('majo')
const { glob, fs } = require('majo')
const logger = require('./logger')

module.exports = async (action, generator) => {
  // Not sure which name is better, let's support both for now
  if (action.type === 'copy' || action.type === 'add') {
    const stream = majo()
    stream.source(action.files, { baseDir: action.cwd })
    if (action.filters) {
      stream.use(require('./middlewares/filters')(action.filters))
    }
    if (action.data) {
      stream.use(require('./middlewares/template')(action))
    }
    await stream.dest(generator.outDir)
  } else if (action.type === 'modify') {
    const stream = majo()
    stream.source(action.files, { baseDir: generator.outDir })
    stream.use(async () => {
      await Promise.all(
        // eslint-disable-next-line array-callback-return
        Object.keys(stream.files).map(async relativePath => {
          const isJson = relativePath.endsWith('.json')
          let contents = stream.fileContents(relativePath)
          if (isJson) {
            contents = JSON.parse(contents)
          }
          let result = await action.handler(contents, relativePath)
          if (isJson) {
            result = JSON.stringify(result, null, 2)
          }
          stream.writeContents(relativePath, result)
          logger.fileAction(
            'yellow',
            'Modified',
            path.join(generator.outDir, relativePath)
          )
        })
      )
    })
    await stream.dest(generator.outDir)
  } else if (action.type === 'move') {
    if (!action.patterns) {
      throw new Error('"patterns" option is required in "move" action!')
    }
    await Promise.all(
      Object.keys(action.patterns).map(async pattern => {
        const files = await glob(pattern, {
          cwd: generator.outDir,
          absolute: true,
          onlyFiles: false
        })
        if (files.length > 1) {
          throw new Error('"move" pattern can only match one file / directory!')
        } else if (files.length === 1) {
          const from = files[0]
          const to = path.join(generator.outDir, action.patterns[pattern])
          await fs.move(from, to, {
            overwrite: true
          })
          logger.fileMoveAction(from, to)
        }
      })
    )
  } else if (action.type === 'remove') {
    const files = await glob(action.files, {
      cwd: generator.outDir,
      absolute: true
    })
    await Promise.all(
      files.map(file => {
        logger.fileAction('red', 'Removed', file)
        return fs.remove(file)
      })
    )
  }
}
