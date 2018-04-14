import match from 'micromatch'
import evaluate from './eval'

export default function filterFiles(filters) {
  return ctx => {
    if (!filters) return

    if (typeof filters === 'function') {
      filters = filters(ctx.meta.merged)
    }

    const fileList = ctx.fileList
    const data = ctx.meta.merged

    const excludePatterns = Object.keys(filters).filter(glob => {
      const condition = filters[glob]
      return !evaluate(condition, data)
    })
    const excluded = match(fileList, excludePatterns, { dot: true })
    for (const relativePath of excluded) {
      ctx.deleteFile(relativePath)
    }
  }
}
