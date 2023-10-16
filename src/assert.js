export function assert(value, message) {
  return equal(!!value, true, message)
}

export function equal(actual, expected, message) {
  if (isNaN(actual))
    return isNaN(expected)

  // eslint-disable-next-line eqeqeq
  if (actual == expected)
    return true

  throw new Error(message ||
    `expected "${actual}" to equal "${expected}"`)

}

assert.equal = equal

export default assert
