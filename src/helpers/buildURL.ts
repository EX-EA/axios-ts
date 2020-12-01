import { isMeaningless, isDate, isObject, isArray } from './utils'

const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, `@`)
    .replace(/%3A/gi, `:`)
    .replace(/%24/g, `$`)
    .replace(/%2C/gi, `,`)
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, `]`)
}

/**
 * 创建get请求url
 * @param url 基础url地址
 * @param params 请求参数
 */
export const buildURL = (url: string, params?: any): string => {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach((paramsKey) => {
    const value = params[paramsKey]

    if (isMeaningless(value)) {
      return
    }

    let values = []
    if (isArray(value)) {
      values = value
      paramsKey += `[]`
    } else {
      values = [value]
    }

    values.forEach((value: any) => {
      if (isDate(value)) {
        value = value.toISOString()
      } else if (isObject(value)) {
        value = JSON.stringify(value)
      }
      parts.push(`${encode(paramsKey)}=${encode(value)}`)
    })

    let serializedParams = parts.join(`&`)

    if (serializedParams) {
      const hashIndex = url.indexOf(`#`)
      if (hashIndex !== -1) {
        url = url.slice(0, hashIndex)
      }

      url += (url.indexOf(`?`) === -1 ? `?` : `&`) + serializedParams
    }

    return url
  })

  return ``
}
