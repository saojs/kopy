import test from 'ava'
import copy from '../'

test.cb('main', t => {
  copy({
    src: './fixture-src',
    dest: './dest',
    data: {
      has: true,
      name: 'hi'
    }
  }, err => {
    const res = require('./dest/hi')
    t.is(res.name, 'hi')
    t.true(res.has)
    t.false(res.hasNot)
    t.end(err)
  })
})
