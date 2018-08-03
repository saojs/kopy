import match from 'micromatch'
import isBinaryPath from 'is-binary-path'
import { arrify } from './utils'

export default (
  {
    skipInterpolation,
    template = require('jstransformer-ejs'),
    templateOptions = {}
  } = {}
) => {
  return ctx => {
    templateOptions =
      typeof templateOptions === 'function'
        ? templateOptions(ctx.meta)
        : templateOptions

    const render = (absolutePath, content, data) => {
      return require('jstransformer')(template).render(
        content,
        Object.assign(
          {
            filename: absolutePath
          },
          templateOptions
        ),
        data
      ).body
    }

    let shouldSkip
    if (skipInterpolation) {
      skipInterpolation = arrify(skipInterpolation)
      shouldSkip = filepath =>
        skipInterpolation.some(condition => {
          if (typeof condition === 'string' || Array.isArray(condition)) {
            const matches = match(ctx.fileList, condition)
            return matches.indexOf(filepath) >= 0
          }
          if (typeof condition === 'function') {
            return condition(filepath, ctx)
          }
          return false
        })
    }

    for (const filepath of ctx.fileList) {
      const content = ctx.fileContents(filepath)

      if (shouldSkip && shouldSkip(filepath, content)) {
        continue
      }

      // Skip binary files
      if (isBinaryPath(filepath)) {
        continue
      }

      const absolutePath = ctx.files[filepath].path
      ctx.writeContents(
        filepath,
        render(absolutePath, content, ctx.meta.merged)
      )
    }
  }
}
