const micromatch = require('micromatch')

module.exports = filters => stream => {
  const excludePatterns = []
  for (const pattern of Object.keys(filters)) {
    if (!filters[pattern]) {
      excludePatterns.push(pattern)
    }
  }
  const excludeFiles = micromatch(stream.fileList, excludePatterns)
  for (const filename of excludeFiles) {
    stream.deleteFile(filename)
  }
}
