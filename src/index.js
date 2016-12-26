import path from 'path'
import Metalsmith from 'metalsmith'
import asyncEach from 'async.each'
import match from 'multimatch'
import isBinaryPath from 'is-binary-path'
import getEngine from './get-engine'

export default function kopy(src, dest, {
  data = {},
  cwd = process.cwd(),
  clean = true,
  skipInterpolation,
  engine = 'handlebars'
} = {}) {
  return new Promise((resolve, reject) => {
    const source = path.resolve(process.cwd(), src)
    Metalsmith(source) // eslint-disable-line new-cap
      .source('.')
      .use(template)
      .clean(clean)
      .destination(path.resolve(cwd, dest))
      .build((err, files) => {
        if (err) return reject(err)
        resolve(Object.keys(files))
      })
  })

  function template(files, metalsmith, done) {
    const keys = Object.keys(files)

    let matchedFile
    if (skipInterpolation) {
      if (typeof skipInterpolation === 'function') {
        matchedFile = skipInterpolation
      } else {
        const matches = match(keys, skipInterpolation)
        matchedFile = file => matches.indexOf(file) !== -1
      }
    }

    asyncEach(keys, run, done)

    function run(file, done) {
      const content = files[file].contents.toString()

      const shouldSkip = matchedFile && matchedFile(file, content)

      // we skip unmathed files (by multimatch or your own function)
      // and binary files
      if (shouldSkip || isBinaryPath(file)) {
        return done()
      }

      const renderer = getEngine(engine)

      renderer.render(content, data, (err, res) => {
        if (err) {
          return done(err)
        }
        files[file].contents = new Buffer(res)
        done()
      })
    }
  }
}
