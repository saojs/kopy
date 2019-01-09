# Prompts

The prompt object is mostly compatiable with [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) with some exceptions:

- NOT supports `rawlist`, `expand`, `editor` prompts.
- NOT supports separator.

We also have a few addtional prompt options listed below.

## cache

- Type: `boolean`
- Default: `undefined`

Whether to cache prompt answer in a local file so that it can be reused next time as the default value.
