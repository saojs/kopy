import path from 'path'
import majo from 'majo'
import filterFiles from './filter-files'
import ask from './ask'
import useTemplate from './template'
import skip from './skip'
import moveFiles from './move-files'

export default function kopy(
  src,
  dest,
  {
    glob = ['**', '!**/node_modules/**'],
    cwd = process.cwd(),
    clean = false,
    // ask options
    data,
    prompts,
    mockPrompts,
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
  } = {}
) {
  const destPath = path.resolve(cwd, dest)
  const base = path.resolve(cwd, src)

  const stream = majo()

  stream
    .source(glob, { baseDir: base })
    .filter(file => {
      return !/\.DS_Store$/.test(file)
    })
    .use(ask(prompts, mockPrompts))
    .use(ctx => {
      data =
        typeof data === 'function' ? data(ctx.meta && ctx.meta.answers) : data
      ctx.meta = {
        ...ctx.meta,
        data,
        merged: {
          ...ctx.meta.answers,
          ...data
        }
      }
    })
    .use(filterFiles(filters))
    .use(moveFiles(move))

  if (!disableInterpolation) {
    stream.use(
      useTemplate({
        skipInterpolation,
        template,
        templateOptions
      })
    )
  }

  if (skipExisting) {
    stream.use(skip(skipExisting, destPath))
  }

  if (write === false) {
    return stream.process().then(() => stream)
  }

  return stream.dest(destPath, { clean }).then(() => stream)
}
