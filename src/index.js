import path from 'path'
import Metalsmith from 'metalsmith'
import async from 'async'
import render from './render'

export default function gracefulCopy({
  src,
  dest,
  data,
  cwd = process.cwd(),
  clean = true
} = {}, cb) {
  const source = path.resolve(cwd, src)
  Metalsmith(source) // eslint-disable-line babel/new-cap
    .source('.')
    .use(template)
    .clean(clean)
    .destination(path.resolve(source, '../', dest))
    .build(err => {
      if (typeof cb === 'function') {
        cb(err)
      }
    })

  function template(files, metalsmith, done) {
    const keys = Object.keys(files)

    async.each(keys, run, done)

    function run(file, done) {
      const str = files[file].contents.toString()
      render(str, data, function (err, res) {
        if (err) {
          return done(err)
        }
        files[file].contents = new Buffer(res)
        done()
      })
    }
  }
}
