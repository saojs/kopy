import path from 'path'
import exists from 'path-exists'

export default function (skipExisting, destPath) {
  return function (files, metalsmith, done) {
    Promise.all(Object.keys(files).map(name => {
      const location = path.join(destPath, name)
      return exists(location)
        .then(yes => {
          if (yes) {
            delete files[name]
            if (typeof skipExisting === 'function') {
              skipExisting(location)
            }
          }
        })
    })).then(() => done()).catch(done)
  }
}
