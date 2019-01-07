const os = require('os')
const path = require('path')
const { fs, glob } = require('majo')
const logger = require('./logger')
const spinner = require('./spinner')
const spawnPromise = require('./spawnPromise')
const KopyError = require('./KopyError')
const runPrompts = require('./runPrompts')
const runAction = require('./runAction')
const validateConfig = require('./validateConfig')

const valOrFunc = (val, ctx) =>
  typeof val === 'function' ? val.call(ctx, ctx) : val

module.exports = class Generator {
  constructor(config) {
    this.opts = {}
    this.logger = logger
    this.config = config
    this.spinner = spinner
    this.fs = fs
  }

  get colors() {
    return require('colorette')
  }

  get outDir() {
    if (this.opts.test) {
      return path.join(os.tmpdir(), `kopy-${Date.now()}`, 'output')
    }
    return path.resolve(this.opts.outDir)
  }

  get outName() {
    if (this.opts.test) {
      return 'output'
    }
    return path.basename(this.outDir)
  }

  async checkGit() {
    if (typeof this.hasGit === 'boolean') return this.hasGit

    this.hasGit = await spawnPromise('git', ['--version']).then(cp => {
      return cp.exitCode === 0
    })
    return this.hasGit
  }

  get npmClient() {
    return this.opts.npmClient || require('./installPackages').getNpmClient()
  }

  get gitInfo() {
    return require('./gitInfo')(this.opts.test)
  }

  get cacheFile() {
    if (this.opts.cacheFile) return this.opts.cacheFile
    return require('env-paths')('kopy-cache').config
  }

  get cacheIdentifier() {
    return !this.opts.test && this.opts.cacheIdentifier
  }

  panic(message) {
    throw new KopyError(message)
  }

  npmInstall(opts) {
    return require('./installPackages')(
      Object.assign(
        {
          registry: this.opts.registry,
          cwd: this.outDir,
          npmClient: this.npmClient
        },
        opts
      )
    )
  }

  async gitInit({ commit } = {}) {
    if (!(await this.checkGit())) return

    const cpOpts = {
      stdio: 'ignore',
      cwd: this.outDir
    }
    const cp = await spawnPromise('git', ['init'], cpOpts)
    if (cp.exitCode === 0) {
      logger.success('Initialized empty Git repository')
      if (commit) {
        await this.gitCommit(commit)
      }
    } else {
      logger.debug(`git init failed in ${this.outDir}`)
    }
  }

  async gitCommit(message) {
    if (!(await this.checkGit())) return

    const cpOpts = {
      stdio: 'ignore',
      cwd: this.outDir
    }
    spinner.start('Committing the Git repository')
    message = typeof message === 'string' ? message : 'init project with kopy'
    await spawnPromise('git', ['add', '-A'], cpOpts)
    await spawnPromise(
      'git',
      ['commit', '-m', `${JSON.stringify(message)}`],
      cpOpts
    )
    spinner.stop()
    logger.success('Committed the Git repository')
  }

  get fileList() {
    this._fileList =
      this._fileList || glob.sync('**', { cwd: this.outDir }).sort()
    return this._fileList
  }

  get pkg() {
    try {
      return require(path.join(this.outDir, 'package.json'))
    } catch (err) {
      return {}
    }
  }

  hasFile(file) {
    return this.fileList.includes(file)
  }

  readFile(file) {
    return fs.readFile(path.join(this.outDir, file), 'utf8')
  }

  readFileSync(file) {
    return fs.readFileSync(path.join(this.outDir, file), 'utf8')
  }

  showProjectTips() {
    spinner.stop() // Stop when necessary
    logger.success(`Generated into ${this.colors.underline(this.outDir)}`)
  }

  async run(opts = {}) {
    this.opts = opts
    logger.setOptions({ logLevel: opts.logLevel || 3 })

    const config = validateConfig(this.config, opts.extendConfigSchema)

    if (config.prepare) {
      await config.prepare.call(this, this)
    }

    const prompts = valOrFunc(config.prompts, this)
    if (prompts) {
      this.answers = await runPrompts(prompts, this)
    }

    const actions = valOrFunc(config.actions, this)
    if (actions && actions.length > 0) {
      for (const action of actions) {
        await runAction(action, this)
      }
    }

    if (config.completed && !opts.test) {
      await config.completed.call(this, this)
    }
  }

  test(answers = true, opts) {
    return this.run(
      Object.assign({}, opts, {
        injectAnswers: answers,
        test: true,
        logLevel: 1
      })
    )
  }

  handleError(err) {
    process.exitCode = 1
    if (err.__kopy) {
      console.error(err.message)
    } else {
      console.error(err.stack)
    }
  }
}
