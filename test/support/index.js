import './chai.js'
import {
  describe,
  it,
  before,
  after,
  beforeEach,
  afterEach
} from 'node:test'

Object.assign(globalThis, {
  describe,
  it,
  before,
  after,
  beforeEach,
  afterEach
})
