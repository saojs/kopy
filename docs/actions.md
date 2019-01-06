# Actions

Actions are used to manipulated files.

## `type: 'copy'`

Copy files to output directory.

| Property         | Type                | Description                                                                                   |
| ---------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| files            | `string` `string[]` | Glob patterns, match some files. e.g. `**` `**/*.md`                                          |
| cwd              | `string`            | The base directory of `files`                                                                 |
| filters          | `object`            | Exclude files from being copied                                                               |
| data             | `any`               | When speified, we all transform the file contents with given data using `ejs` template engine |
| transformFilters | `object`            | Exclude files in the transformation                                                           |

`filters` example:

```js
{
  type: 'add',
  files: '**',
  filters: {
    '**/*.ts': this.answers.ts
  }
}
```

In fact this option is just for convenience, you can also use `files` to filters files:

```js
{
  type: 'add',
  files: [
    '**',
    this.answers.ts && '!**/*.ts'
  ].filter(Boolean)
}
```

## `type: 'modify'`

Modify files in output directory.

| Property | Type                                                              | Description                                          |
| -------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| files    | `string` `string[]`                                               | Glob patterns, match some files. e.g. `**` `**/*.md` |
| handler  | `(content: Buffer | object, filepath: string) => Buffer | object` | The return value will be the new file content.       |  |

For `.json` files, you will get deserialized JSON object instead of `Buffer`:

```js
{
  files: 'package.json',
  handler(content) {
    content.name = 'my-project'
    return content
  }
}
```

## `type: 'move'`

Move files in output directory.

| Property | Type     | Description                                     |
| -------- | -------- | ----------------------------------------------- |
| patterns | `object` | key-value record, the key supports glob pattern |

```js
{
  type: 'move',
  patterns: {
    'config-*.js': 'config.js'
  }
}
```

## `type: 'remove'`

Remove files in output directory.

| Property | Type                | Description                               |
| -------- | ------------------- | ----------------------------------------- |
| files    | `string` `string[]` | Glob patterns, match some files to remove |
