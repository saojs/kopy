# Config

## config.prompts

- Type: `Array<Prompt> | (this: Generator) => Array<Prompt>`

An array of [prompts](./prompts.md).

## config.actions

- Type: `Array<Action> | (this: Generator) => Array<Action>`

An array of [actions](./actions.md), executed in sequence.

## config.preapre

- Type: `(this: Generator) => void | Promise<void>`

Run before everything, you can use it exit the generating process:

```js
const fs = require('fs')

const config = {
  prepare() {
    if (!this.hasFileSync('package.json')) {
      return this.panic(`package.json does not exiting in output directory`)
    }
  }
}
```

## config.completed

- Type: `(this: Generator) => void | Promise<void>`

Run after [actions](./actions.md).
