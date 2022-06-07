import { jsonSchema } from '../index.js'
const { formats } = jsonSchema

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    date: { type: 'string', format: 'edtf/1+season-intervals' },
    validates: { type: 'boolean' },
  },
  required: ['date'],
  additionalProperties: false
}

import Ajv from 'ajv'
const ajv = jsonSchema.ajv(new Ajv())

import BasicZSchema from 'z-schema'
const ZSchema = jsonSchema.zschema(BasicZSchema)
const zschema = new ZSchema()
// console.log(ZSchema.getRegisteredFormats())

import IMJV from 'is-my-json-valid'
const imjv = IMJV(schema, { formats })

import JSEN from 'jsen'
const jsen = JSEN(schema, { formats })

const dates = [
  {
    name: 'validates wildcard date',
    date: '2016-XX',
    validates: true
  },
  {
    name: 'validates season-interval',
    date: '2017-24/2018-21',
    validates: true
  },
  {
    name: 'fails invalid date',
    date: 'invalid',
    validates: false
  },
]

describe('JSON schema', () => {
  for (const date of dates) {
    it(`${date.name} ${JSON.stringify(date.date)} with ajv`, () => {
      expect(ajv.validate(schema, date)).to.equal(date.validates)
    })
    it(`${date.name} ${JSON.stringify(date.date)} with z-schema`, () => {
      expect(zschema.validate(date, schema)).to.equal(date.validates)
    })
    it(`${date.name} ${JSON.stringify(date.date)} with is-my-json-valid`, () => {
      expect(imjv(date)).to.equal(date.validates)
    })
    it(`${date.name} ${JSON.stringify(date.date)} with jsen`, () => {
      expect(jsen(date)).to.equal(date.validates)
    })
  }
})
