import path from 'path'
import Metalsmith from 'metalsmith'
import filterFiles from './filter-files'
import ask from './ask'
import useTemplate from './template'
import skip from './skip'

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
  skipExisting
} = {}) {
  return new Promise((resolve, reject) => {
    const source = path.resolve(cwd, src)
    const destPath = path.resolve(cwd, dest)
    const pipe = Metalsmith(source) // eslint-disable-line new-cap

    pipe
      .source('.')
      .ignore(file => {
        return /\.DS_Store$/.test(file)
      })
      .use(ask(data, prompts))
      .use(filterFiles(filters))

    if (!disableInterpolation) {
      pipe.use(useTemplate({skipInterpolation, template, templateOptions}))
    }

    if (skipExisting) {
      pipe.use(skip(skipExisting, destPath))
    }

    pipe
      .clean(clean)
      .destination(destPath)
      .build((err, files) => {
        if (err) return reject(err)
        resolve({
          files: Object.keys(files),
          ...pipe.metadata()
        })
      })
  })
}
