import match from 'multimatch'

export default transforms => stream => {
  const globs = Object.keys(transforms)
  return Promise.all(globs.map(glob => {
    const handler = transforms[glob]
    const filepaths = match(stream.fileList, glob)
    return Promise.all(filepaths.map(filepath => {
      return handler(filepath, stream)
    }))
  }))
}
