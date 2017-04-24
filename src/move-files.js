export default function (move) {
  return function (files, metalsmith, done) {
    if (!move) return done()

    for (const oldName in move) {
      const content = files[oldName]
      delete files[oldName]
      files[move[oldName]] = content
    }

    done()
  }
}
