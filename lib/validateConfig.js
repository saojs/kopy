const { struct } = require('superstruct')
const KopyError = require('./KopyError')

module.exports = config => {
  // TODO: improve prompts and actions validation
  const res = struct({
    prepare: struct.optional('function'),
    prompts: struct.optional(struct.union(['array', 'function'])),
    actions: struct.optional(struct.union(['array', 'function'])),
    completed: struct.optional('function')
  })

  const [error, result] = res.validate(config)
  if (error) {
    throw new KopyError(`Invalid Kopy config: ${error.message}`)
  }
  return result
}
