export const toString = (val: any) => Object.prototype.toString.call(val)

export const isMeaningless = (val: any) => val === null || typeof val === 'undefined'

export const isDate = (val: any): val is Date => val instanceof Date

export const isObject = (val: unknown): val is Object => val !== null && typeof val === 'object'

export const isPlainObject = (val: unknown): val is Object => toString(val) === `[object Object]`

export const isArray = <T = any>(val: unknown): val is Array<T> => Array.isArray(val)

export const hasOwn = (val: unknown, key: string): val is Object =>
  Object.prototype.hasOwnProperty.call(val, key)

export const forEach = (
  obj: Object | Array<unknown>,

  fn: (value: unknown, key?: unknown, obj?: Object | Array<unknown>) => any
) => {
  if (isMeaningless(obj)) {
    return
  }

  if (typeof obj !== `object`) {
    obj = [obj]
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // object
    for (let key in obj as Object) {
      if (hasOwn(obj, key)) {
        // @ts-ignore
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

export const extend = <T, U>(to: T, from: U): T & U => {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }

  return to as T & U
}

/**
 *
 * @param objs obj1, obj2, obj3...
 */
export const deepMerge = (...objs: Record<string, any>[]) => {
  const result = Object.create(null)

  objs.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key]

        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = deepMerge(result[key], val)
        } else if (isPlainObject(val)) {
          result[key] = deepMerge(val)
        } else if (isArray(val)) {
          result[key] = val.slice()
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
