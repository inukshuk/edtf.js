const keys = Reflect.ownKeys.bind(Reflect)
const descriptor = Object.getOwnPropertyDescriptor.bind(Object)
const define = Object.defineProperty.bind(Object)
const has = Object.prototype.hasOwnProperty

export function mixin(target, ...mixins) {
  for (let source of mixins) {
    inherit(target, source)
    inherit(target.prototype, source.prototype)
  }

  return target
}

function inherit(target, source) {
  for (let key of keys(source)) {
    if (!has.call(target, key)) {
      define(target, key, descriptor(source, key))
    }
  }
}
