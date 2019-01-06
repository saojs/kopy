const { struct, superstruct } = require('superstruct')
const KopyError = require('./KopyError')

module.exports = (config, extendConfigSchema) => {
  // TODO: improve prompts and actions validation
  const schema = {
    prepare: struct.optional('function'),
    prompts: struct.optional(struct.union(['array', 'function'])),
    actions: struct.optional(struct.union(['array', 'function'])),
    completed: struct.optional('function')
  }

  if (typeof extendConfigSchema === 'function') {
    extendConfigSchema(schema, struct, superstruct)
  }

  const res = struct(schema)

  const [error, result] = res.validate(config)
  if (error) {
    throw new KopyError(`Invalid Kopy config: ${error.message}`)
  }
  return result
}
