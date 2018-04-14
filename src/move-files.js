import match from 'micromatch'

export default function(move) {
  return ctx => {
    if (typeof move === 'function') {
      move = move(ctx.meta.merged)
    }

    if (!move) return

    for (const pattern in move) {
      const matches = match.match(ctx.fileList, pattern)
      if (matches.length > 0) {
        const newName = move[pattern]
        if (typeof newName === 'function') {
          for (const match of matches) {
            const file = ctx.file(match)
            const fileName = newName(match)
            // eslint-disable-next-line max-depth
            if (fileName) {
              ctx.deleteFile(match)
              ctx.createFile(fileName, file)
            }
          }
        } else if (typeof newName === 'string') {
          const file = ctx.file(matches[0])
          ctx.deleteFile(matches[0])
          ctx.createFile(newName, file)
        }
      }
    }
  }
}
