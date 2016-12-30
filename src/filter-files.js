// forked from https://github.com/vuejs/vue-cli/blob/master/lib/filter.js
import match from 'minimatch'
import evaluate from './eval'

function filter(files, filters, data, done) {
  if (!filters) {
    return done()
  }
  const fileNames = Object.keys(files)
  Object.keys(filters).forEach(glob => {
    fileNames.forEach(file => {
      if (match(file, glob, {dot: true})) {
        const condition = filters[glob]
        if (!evaluate(condition, data)) {
          delete files[file]
        }
      }
    })
  })
  done()
}

export default function filterFiles(filters) {
  return function (files, metalsmith, done) {
    filter(files, filters, metalsmith.metadata().merged, done)
  }
}
