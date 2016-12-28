import path from 'path'
import Metalsmith from 'metalsmith'
import filterFiles from './filter-files'
import ask from './ask'
import noop from './noop'
import template from './template'

export default function kopy(src, dest, {
  cwd = process.cwd(),
  clean = false,
  // ask options
  data,
  prompts,
  // template options
  disableInterpolation = false,
  skipInterpolation,
  engine = 'handlebars',
  // filter options
  filters
} = {}) {
  return new Promise((resolve, reject) => {
    const source = path.resolve(cwd, src)
    Metalsmith(source) // eslint-disable-line new-cap
      .source('.')
      .ignore(file => /node_modules/.test(file))
      .use(ask(data, prompts))
      .use(filterFiles(filters))
      .use(disableInterpolation ? noop : template({skipInterpolation, engine}))
      .clean(clean)
      .destination(path.resolve(cwd, dest))
      .build((err, files) => {
        if (err) return reject(err)
        resolve(Object.keys(files))
      })
  })
}
