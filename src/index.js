import path from 'path'
import majo from 'majo'
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
  const destPath = path.resolve(cwd, dest)
  const base = path.resolve(cwd, src)

  const done = stream => ({
    files: stream.files,
    fileList: stream.fileList,
    ...stream.meta
  })

  const stream = majo()

  stream
    .source('**', { cwd: base })
    .filter(file => {
      return !/\.DS_Store$/.test(file)
    })
    .use(ask(data, prompts))
    .use(filterFiles(filters))
    .use(moveFiles(move))

  if (!disableInterpolation) {
    stream.use(useTemplate({
      skipInterpolation,
      template,
      templateOptions: typeof templateOptions === 'function' ? templateOptions(stream.meta) : templateOptions
    }))
  }

  if (skipExisting) {
    stream.use(skip(skipExisting, destPath))
  }

  if (write === false) {
    return stream.process()
      .then(() => done(stream))
  }

  return stream.dest(destPath, { clean })
    .then(() => done(stream))
}
