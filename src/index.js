import path from 'path'
import Metalsmith from 'metalsmith'
import filterFiles from './filter-files'
import ask from './ask'
import useTemplate from './template'
import skip from './skip'
import moveFiles from './move-files'

export default function kopy(src, dest, {
  cwd = process.cwd(),
  clean = false,
  // ask options
  data,
  prompts,
  // template options
  disableInterpolation = false,
  skipInterpolation,
  template,
  templateOptions,
  // filter options
  filters,
  // skip existing file
  skipExisting,
  move,
  write = true
} = {}) {
  return new Promise((resolve, reject) => {
    const source = path.resolve(cwd, src)
    const destPath = path.resolve(cwd, dest)
    const pipe = Metalsmith(source) // eslint-disable-line new-cap

    const done = (err, files) => {
      if (err) return reject(err)
      resolve({
        files,
        ...pipe.metadata()
      })
    }

    pipe
      .source('.')
      .ignore(file => {
        return /\.DS_Store$/.test(file)
      })
      .use(ask(data, prompts))
      .use(filterFiles(filters))
      .use(moveFiles(move))

    if (!disableInterpolation) {
      pipe.use(useTemplate({skipInterpolation, template, templateOptions}))
    }

    if (skipExisting) {
      pipe.use(skip(skipExisting, destPath))
    }

    pipe
      .clean(clean)
      .destination(destPath)

    if (write === false) {
      return pipe.process(done)
    }

    pipe.build(done)
  })
}
