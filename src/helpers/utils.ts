export const toString = (val: any) => Object.prototype.toString.call(val)

export const isMeaningless = (val: any) => val === null || typeof val === 'undefined'

export const isDate = (val: any): val is Date => val instanceof Date

export const isObject = (val: any): boolean => val !== null && typeof val === 'object'

export const isPlainObject = (val: unknown): val is Object => toString(val) === `[object Object]`

export const isArray = (val: any): boolean => Array.isArray(val)
