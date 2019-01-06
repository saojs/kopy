module.exports = class KopyError extends Error {
  constructor(msg) {
    super(msg)
    this.__kopy = true
  }
}
