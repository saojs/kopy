const micromatch = require('micromatch')
const isBinary = require('is-binary-path')

module.exports = action => stream => {
  let files = stream.fileList
  if (action.transformFilters) {
    const excludePatterns = Object.keys(action.transformFilters).reduce(
      (res, key) => {
        if (!action.transformFilters[key]) {
          res.push(key)
        }
        return res
      },
      []
    )
    files = micromatch.not(files, excludePatterns)
  }
  for (const filename of files) {
    if (isBinary(filename)) {
      continue
    }
    const ejs = require('jstransformer')(require('jstransformer-ejs'))
    const newContents = ejs.render(
      stream.fileContents(filename),
      action.transformerOptions,
      action.data
    ).body
    stream.writeContents(filename, newContents)
  }
}
