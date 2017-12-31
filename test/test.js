/* eslint-disable import/no-unresolved */
import fs from 'fs'
import test from 'ava'
import rm from 'rimraf'
import copy from '../src'

const oldCwd = process.cwd()

test.before(() => {
  process.chdir(__dirname)
})

test.after('cleanup', () => {
  rm.sync('./dest*')
  process.chdir(oldCwd)
})

test('main', async t => {
  const { fileList } = await copy('./fixture-src', './dest', {
    data: {
      has: true,
      name: 'hi'
    }
  })
  const res = require('./dest/hi')
  t.is(res.name, 'hi')
  t.true(res.has)

  // check files
  t.deepEqual(fileList, ['deep/bye.json', 'hi.json'])

  const foo = require('./dest/deep/bye')
  t.is(foo.name, 'hi')
})

test('it should skip interpolation by glob patterns', async t => {
  await copy('./fixture-src', './dest-skip', {
    data: {
      name: 'hi',
      has: true
    },
    skipInterpolation: ['deep/bye.*']
  })
  const bar = require('./dest-skip/deep/bye')
  t.is(bar.name, '<%= name %>')
})

test('it supports custom template engine', async t => {
  await copy('./fixture-hbs', './dest-hbs', {
    template: require('jstransformer-handlebars'),
    data: {
      foo: true
    }
  })
  const content = fs.readFileSync('./dest-hbs/foo.txt')
  t.true(content.indexOf('this is hbs') > -1)
  t.true(content.indexOf('{{') === -1)
})

test('it filters files', async t => {
  const { fileList } = await copy('./fixture-filter', './dest-filter', {
    filters: {
      'foo/**': false,
      'bar.js': '!!12'
    }
  })
  t.deepEqual(fileList, ['bar.js'])
})

test('disableInterpolation', async t => {
  await copy('./fixture-src', './dest-disableInterpolation', {
    disableInterpolation: true
  })
  const foo = fs.readFileSync('./dest-disableInterpolation/hi.json')
  t.true(foo.indexOf('if (has)') > -1)
})

test('it returns metadata', async t => {
  const {
    meta: { data }
  } = await copy('./fixture-src', './dest-disableInterpolation', {
    disableInterpolation: true,
    data: { wow: true }
  })
  t.deepEqual(data, { wow: true })
})

test('it moves files', async t => {
  const { fileList } = await copy('./fixture-move', './dest-move', {
    disableInterpolation: true,
    move: {
      'foo-*.json': 'foo.json',
      'ba*': filepath => filepath.replace(/^ba/, 'ab')
    },
    write: false
  })
  t.snapshot(fileList, 'generated files')
})

test('mock prompts', async t => {
  await t.throws(
    copy('./fixture-mock', './dest-mock', {
      prompts: [{ name: 'foo', validate: v => v === 'foo' }],
      mockPrompts: {
        foo: 'bar'
      },
      write: false
    }),
    'Validation failed at prompt "foo"'
  )

  await t.throws(
    copy('./fixture-mock', './dest-mock', {
      prompts: [{ name: 'foo', validate: () => 'nah' }],
      mockPrompts: {
        foo: 'bar'
      },
      write: false
    }),
    'Validation failed at prompt "foo":\nnah'
  )

  const res = await copy('./fixture-mock', './dest-mock', {
    prompts: [
      { name: 'foo', type: 'confirm' },
      { name: 'bar', type: 'confirm', default: false },
      { name: 'promise', default: async () => 'foo-bar' }
    ],
    write: false,
    mockPrompts: {}
  })
  t.deepEqual(res.meta.answers, { foo: true, bar: false, promise: 'foo-bar' })
})

test('glob option', async t => {
  const { fileList } = await copy('./fixture-glob', './dest-glob', {
    glob: 'foo/*.js',
    write: false
  })
  t.deepEqual(fileList, ['foo/bar.js'])
})
