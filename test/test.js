import test from 'ava'
import copy from '../src'

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
  t.deepEqual(files, ['hi.json'])
})
