export const isMeaningless = (val: any) => val === null || typeof val === 'undefined'

export const isDate = (val: any): val is Date => val instanceof Date

export const isObject = (val: any): boolean => val !== null && typeof val === 'object'

export const isArray = (val: any): boolean => Array.isArray(val)
