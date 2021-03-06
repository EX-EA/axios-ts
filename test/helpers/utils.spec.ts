import {
  isDate,
  isPlainObject,
  isFormData,
  isURLSearchParams,
  extend,
  deepMerge,
  isMeaningless,
  hasOwn,
  forEach,
} from '../../src/helpers/utils'

describe('helpers:util', () => {
  describe('isXX', () => {
    test('should validate Date', () => {
      let temp
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
      expect(isMeaningless(temp)).toBeTruthy()
    })

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })

    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }

      extend(a, b)

      expect(a.foo).toBe(123)
    })

    test('should extend properties', function () {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)

      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }

      deepMerge(a, b, c)

      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })

    test('should deepMerge properties', () => {
      const a = { foo: 123 }
      const b = { bar: 456 }
      const c = { foo: 789 }
      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })

    test('should deepMerge recursively', function () {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456,
        },
        bar: {
          qux: 789,
        },
      })
    })

    test('should remove all references from nested objects', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123,
        },
      })

      expect(c.foo).not.toBe(a.foo)
    })

    test('should merge arr', () => {
      const a = { arr: [1, 2, 3], age: 14 }
      const b = { foo: { arr: [4, 5, 6] } }
      const c = deepMerge(a, b)

      expect(c.arr).toEqual([1, 2, 3])
    })

    // test('should handle null and undefined arguments', () => {
    //   expect(deepMerge(undefined, undefined)).toEqual({})
    //   expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
    //   expect(deepMerge({ foo: 123 }, undefined)).toEqual({ foo: 123 })

    //   expect(deepMerge(null, null)).toEqual({})
    //   expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
    //   expect(deepMerge({ foo: 123 }, null)).toEqual({ foo: 123 })
    // })
  })

  describe('hasXX', () => {
    test('should has a property with the specified name.', () => {
      const person = { age: 18 }

      expect(hasOwn(person, 'age')).toBeTruthy()
    })
  })

  describe('forEach', () => {
    test('should traverse key in array and obj', () => {
      const arr = [1, 2, 4]
      const person = { age: 18, name: 'kan' }
      let sum = 0

      forEach(arr, (value) => {
        sum += value as number
      })
      forEach(person, (_value, key) => {
        if (key === 'name') {
          person[key] = 'chen'
        }
      })

      expect(sum).toBe(7)
      expect(person.name).toBe('chen')
    })
  })
})
