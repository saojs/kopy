import fs from 'fs'
import test from 'ava'
import copy from '../src'
import {spawnSync} from 'child_process'
import rm from 'rimraf'

test.after('cleanup', () => {
  rm.sync('./dest*')
})

test('main', async t => {
  const {files} = await copy('./fixture-src', './dest', {
    data: {
      has: true,
      name: 'hi'
    }
  })
  const res = require('./dest/hi')
  t.is(res.name, 'hi')
  t.true(res.has)

  // check files
  t.deepEqual(files, ['hi.json', 'deep/bye.json'])

  const foo = require('./dest/deep/bye')
  t.is(foo.name, 'hi')
})

test('it should skip interpolation by glob patterns', async t => {
  const {files} = await copy('./fixture-src', './dest-skip', {
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
  const {files} = await copy('./fixture-src', './dest-filter', {
    data: {
      name: 'foo'
    },
    filters: {
      '*.json': 'false'
    }
  })
  t.deepEqual(files, ['deep/bye.json'])
})

test('disableInterpolation', async t => {
  const {files} = await copy('./fixture-src', './dest-disableInterpolation', {
    disableInterpolation: true
  })
  const foo = fs.readFileSync('./dest-disableInterpolation/hi.json')
  t.true(foo.indexOf('if (has)') > -1)
})

test('it returns metadata', async t => {
  const {data} = await copy('./fixture-src', './dest-disableInterpolation', {
    disableInterpolation: true,
    data: {wow: true}
  })
  t.deepEqual(data, {wow: true})
})
