import minimatch from 'minimatch'

export default function (move) {
  return ctx => {
    if (!move) return

    if (typeof move === 'function') {
      move = move(ctx.meta.merged)
    }

    for (const pattern in move) {
      const matches = minimatch.match(ctx.fileList, pattern)
      if (matches.length > 0) {
        const file = ctx.file(matches[0])
        for (const match of matches) {
          ctx.deleteFile(match)
        }
        const newName = move[pattern]
        ctx.createFile(newName, file)
      }
    }
  }
}
