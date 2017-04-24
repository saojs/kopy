import minimatch from 'minimatch'

export default function (move) {
  return function (files, metalsmith, done) {
    if (!move) return done()

    for (const pattern in move) {
      const matches = minimatch.match(Object.keys(files), pattern)
      if (matches.length > 0) {
        const content = files[matches[0]]
        for (const match of matches) {
          delete files[match]
        }
        const newName = move[pattern]
        files[newName] = content
      }
    }

    done()
  }
}
