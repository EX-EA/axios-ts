import { isPlainObject, forEach } from './utils'

export const normalizeHeaderName = (headers: any, normalizedName: string) => {
  Object.keys(headers).forEach((header) => {
    if (header !== normalizedName && header.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[header]
      delete headers[header]
    }
  })
}

export const processHeaders = (headers: any, data: any) => {
  if (!headers) {
    return
  }

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
    let [key, val] = (line as string).split(`:`)
    key = key.trim()
    if (!key) {
      return
    }

    if (val) {
      val = val.trim()
    }

    parsed[key] = val
  })
  return parsed
}
