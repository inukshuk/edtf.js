export function assert(value, message) {
  return equal(!!value, true, message ||
    `expected "${value}" to be ok`)
}

export function equal(actual, expected, message) {
  // eslint-disable-next-line eqeqeq
  if (actual == expected)
    return true

  if (Number.isNaN(actual) && Number.isNaN(expected))
    return true

  throw new Error(message ||
    `expected "${actual}" to equal "${expected}"`)
}

assert.equal = equal

export default assert
