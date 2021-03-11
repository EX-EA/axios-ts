import { isPlainObject, forEach, deepMerge } from './utils'
import { RequestMethod } from 'types'

export const normalizeHeaderName = (headers: any = {}, normalizedName: string) => {
  Object.keys(headers).forEach((header) => {
    if (header !== normalizedName && header.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[header]
      delete headers[header]
    }
  })
}

export const processHeaders = (headers: Record<string, unknown>, data: any) => {
  // if (!headers) {
  //   return
  // }

  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers[`Content-Type`] = `application/json;charset=utf-8`
    }
  }

  return headers
}

export const parseHeaders = (headers: string) => {
  let parsed = Object.create(null)

  if (!headers) {
    return parsed
  }

  forEach(headers.split('\r\n'), (line) => {
    let [key, ...vals] = (line as string).split(`:`)
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }

    let val = vals.join(':').trim()

    parsed[key] = val
  })
  return parsed
}

export const flattenHeaders = (headers: any, method: RequestMethod) => {
  if (!headers) {
    return headers
  }

  const methods = ['delete', 'get', 'head', 'post', 'put', 'patch', 'options', 'common']
  headers = deepMerge(headers.common, headers[method], headers)

  methods.forEach((method) => {
    delete headers[method]
  })

  return headers
}
