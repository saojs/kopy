const path = require('path')
const colors = require('colorette')

class Logger {
  constructor(options) {
    this.options = Object.assign(
      {
        logLevel: 3
      },
      options
    )
  }

  setOptions(options) {
    Object.assign(this.options, options)
  }

  // level: 4
  debug(...args) {
    if (this.options.logLevel < 4) {
      return
    }

    this.status('magenta', 'debug', ...args)
  }

  // level: 2
  warn(...args) {
    if (this.options.logLevel < 2) {
      return
    }
    console.warn(colors.yellow('warning'), ...args)
  }

  // level: 1
  error(...args) {
    if (this.options.logLevel < 1) {
      return
    }
    process.exitCode = process.exitCode || 1
    console.error(colors.red('error'), ...args)
  }

  // level: 3
  success(...args) {
    this.status('green', 'success', ...args)
  }

  // level: 3
  tip(...args) {
    this.status('blue', 'tip', ...args)
  }

  info(...args) {
    this.status('cyan', 'info', ...args)
  }

  status(color, label, ...args) {
    if (this.options.logLevel < 3) {
      return
    }
    console.log(colors[color](label), ...args)
  }

  fileAction(color, type, fp) {
    if (this.options.logLevel < 3) {
      return
    }
    this.info(
      `${colors[color](type)} ${colors.green(path.relative(process.cwd(), fp))}`
    )
  }

  fileMoveAction(from, to) {
    if (this.options.logLevel < 3) {
      return
    }
    this.info(
      `${colors.blue('Moved')} ${colors.green(
        path.relative(process.cwd(), from)
      )} ${colors.dim('->')} ${colors.green(path.relative(process.cwd(), to))}`
    )
  }
}

module.exports = new Logger()
