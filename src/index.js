import path from 'path'
import Metalsmith from 'metalsmith'
import asyncEach from 'async.each'
import match from 'multimatch'
import isBinaryPath from 'is-binary-path'
import getEngine from './get-engine'

export default function gracefulCopy(src, dest, {
  data = {},
  cwd = process.cwd(),
  clean = true,
  skipInterpolation,
  engine = 'handlebars',
  exclude
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

    const matchedFiles = skipInterpolation && match(keys, skipInterpolation)

    asyncEach(keys, run, done)

    function run(file, done) {
      const str = files[file].contents.toString()
      // skip interpolation by glob patterns like *.vue
      const shouldSkip = matchedFiles && (matchedFiles.indexOf(file) !== -1)
      const shouldExclude = exclude && exclude(file, str)

      if (shouldSkip || shouldExclude || isBinaryPath(file)) {
        return done()
      }

      const renderer = getEngine(engine)

      renderer.render(str, data, (err, res) => {
        if (err) {
          return done(err)
        }
        files[file].contents = new Buffer(res)
        done()
      })
    }
  }
}
