# Generator

A generator instance is returned by `kopy(config)`.

## generator.outDir

- Type: `string`

The absolute path to output directory

## generator.outName

- Type: `string`

The name of output directory

## generator.answers

- Type: `object`

The prompt answers, therefore not available in `prompts`.

## generator.npmClient

- Type: `string`
- Default: `yarn` when `yarn` command exists, `npm` otherwise.
- Values: `npm` `yarn`

npm client that is used to install packages, fallback to inferred value when not specified.

## generator.pkg

- Type: `object`

The content of `package.json` in output directory, defaults to `{}` when it doesn't exists.

## generator.gitInit

- Type: `(opts: InitOpts) => Promise<void>`

Run `git init` in output directory.

```ts
interface InitOpts {
  // Also run `git add -A && git commit -m "<message>"` after `git init`
  // When `true` we use a default commit message
  commit?: boolean | string
}
```

## generator.gitCommit

- Type: `(message?: string) => Promise<void>`

Run `git add -A` and `git commit -m "message"` in the output directory.

## generator.npmInstall

- Type: `(opts: InstallOpts) => Promise<void>`

Install packages in output directory.

```ts
interface InstallOpts {
  /** npm registry */
  registry?: string
  /** Additional command args */
  args?: string[]
  /** Add new packages instead of (re-)install exiting packages */
  packages?: string[]
  /** Add new packages as dev dependencies */
  saveDev?: boolean
}
```

## generator.fileList

- Type: `string[]`

Get a list of files in output directory.

## generator.readFile

- Type: `(filename: string) => Promise<string>`

Read a file in output directory.

## generator.readFileSync

Like `generator.readFile` but returns a `string` instead of `Promise<string>`.

## generator.hasFile

- Type: `(filename: string) => boolean`

Check if a file exists in output directory.

## generator.run

- Type: `(opts: Opts) => Promise<void>`

Run the generator.

```ts
interface Opts {
  outDir: string
  npmClient?: string
  logLevel?: number
  /** Where to store the cache of prompt answers */
  cacheFile?: string
  /**
   * Used to invalidate the cache
   * It's usually `yourPkg.name` + `yourPkg.version`
   * You must set this to enable the cache
   */
  cacheIdentifier?: string
  /** npm registry */
  registry?: string
  extendConfigSchema?: (
    schema: object,
    struct: Struct,
    superStruct: SuperStruct
  ) => void
}
```

Check out [validateSchema.js](https://github.com/saojs/kopy/blob/master/lib/validateConfig.js) for the underlying schema we use to validate the config.

## generator.emulate

- Type: `(emulator?: Emulator) => Promise<void>`

Emulate running the generator.

### emulator

- Type: `(prompt: enquirer.prompt) => void`

By default, running `generator.emulate()` will emulate using the initial values for prompts, the `emulator` it uses looks like:

```js
const defaultEmulator = prompt => {
  prompt.on('prompt', prompt => {
    prompt.submit()
  })
}
```
