import test from 'ava'
import copy from '../src'
import {spawnSync} from 'child_process'

test.afterEach(() => {
  spawnSync('rm', ['-rf', './dest'])
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
  t.deepEqual(files, ['hi.json', 'deep/bye.json'])
})
