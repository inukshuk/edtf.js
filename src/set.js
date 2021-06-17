import { List } from './list.js'
import { parse } from './parser.js'

export class Set extends List {
  static parse(input) {
    return parse(input, { types: ['Set'] })
  }

  get type() {
    return 'Set'
  }

  wrap(content) {
    return `[${content}]`
  }
}
