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
    skipInterpolation: [
      'deep/bye.*'
    ]
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
  const { fileList } = await copy('./fixture-src', './dest-filter', {
    data: {
      name: 'foo',
      has: true
    },
    filters: {
      '*.json': 'false'
    }
  })
  t.deepEqual(fileList, ['deep/bye.json'])
})

test('disableInterpolation', async t => {
  await copy('./fixture-src', './dest-disableInterpolation', {
    disableInterpolation: true
  })
  const foo = fs.readFileSync('./dest-disableInterpolation/hi.json')
  t.true(foo.indexOf('if (has)') > -1)
})

test('it returns metadata', async t => {
  const { meta: { data } } = await copy('./fixture-src', './dest-disableInterpolation', {
    disableInterpolation: true,
    data: { wow: true }
  })
  t.deepEqual(data, { wow: true })
})

test('it moves files', async t => {
  const { fileList } = await copy('./fixture-src', './dest-move', {
    disableInterpolation: true,
    move: {
      'deep/bye.json': 'so-deep/hi.json'
    }
  })
  t.deepEqual(fileList, ['hi.json', 'so-deep/hi.json'])
})
