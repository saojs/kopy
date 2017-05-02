import path from 'path'
import exists from 'path-exists'

export default function (skipExisting, destPath) {
  return ctx => {
    return Promise.all(ctx.fileList.map(name => {
      const location = path.join(destPath, name)
      return exists(location)
        .then(yes => {
          if (yes) {
            ctx.deleteFile(name)
            if (typeof skipExisting === 'function') {
              skipExisting(location, name)
            }
          }
        })
    }))
  }
}
