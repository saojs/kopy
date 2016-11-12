import test from 'ava'
import copy from '../src'
import {spawnSync} from 'child_process'
import rm from 'rimraf'

test.after('cleanup', () => {
  rm.sync('./dest*')
})

test('main', async t => {
  const files = await copy('./fixture-src', './dest', {
    data: {
      has: true,
      name: 'hi'
    }
  })
  const res = require('./dest/hi')
  t.is(res.name, 'hi')
  t.true(res.has)
  t.false(res.hasNot)

  // check files
  t.deepEqual(files, ['hi.json', 'skipInterpolation.json', 'deep/bye.json'])

  const foo = require('./dest/deep/bye')
  t.is(foo.name, 'hi')
})

test('it should skip interpolation by glob patterns', async t => {
  const files = await copy('./fixture-src', './dest-skip', {
    data: {
      name: 'hi'
    },
    skipInterpolation: [
      'skipInterpolation.json',
      'deep/bye.*'
    ]
  })
  const foo = require('./dest-skip/skipInterpolation')
  const bar = require('./dest-skip/deep/bye')
  t.is(foo.name, '{{ name }}')
  t.is(bar.name, '{{ name }}')
})
