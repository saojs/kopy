import path from 'path'
import Metalsmith from 'metalsmith'
import asyncEach from 'async.each'
import match from 'multimatch'
import render from './render'

export default function gracefulCopy(src, dest, {
  data,
  cwd = process.cwd(),
  clean = true,
  skipInterpolation
} = {}) {
  return new Promise((resolve, reject) => {
    const source = path.resolve(cwd, src)
    Metalsmith(source) // eslint-disable-line new-cap
      .source('.')
      .use(template)
      .clean(clean)
      .destination(path.resolve(source, '../', dest))
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
      // do not attempt to render files that do not have mustaches
      const noMustache = !/{{([^{}]+)}}/g.test(str)
      // skip interpolation by glob patterns like *.vue
      const shouldSkip = matchedFiles && (matchedFiles.indexOf(file) !== -1)

      if (shouldSkip || noMustache) {
        return done()
      }
      render(str, data, (err, res) => {
        if (err) {
          return done(err)
        }
        files[file].contents = new Buffer(res)
        done()
      })
    }
  }
}
