import { isMeaningless, isDate, isPlainObject, isArray, isURLSearchParams } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

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
export const buildURL = (
  url: string,
  params?: any,
  paramsSerializer?: (params: unknown) => string
): string => {
  if (!params) {
    return url
  }

  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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
        } else if (isPlainObject(value)) {
          value = JSON.stringify(value)
        }
        parts.push(`${encode(paramsKey)}=${encode(value)}`)
      })
    })

    serializedParams = parts.join(`&`)
  }

  if (serializedParams) {
    const hashIndex = url.indexOf(`#`)
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }

    url += (url.indexOf(`?`) === -1 ? `?` : `&`) + serializedParams
  }

  return url
}

const urlParsingNode = document.createElement(`a`)

const resolveURL = (url: string): URLOrigin => {
  urlParsingNode.setAttribute(`href`, url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host,
  }
}

const originURL = resolveURL(window.location.href)

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

export const isURLSameOrigin = (requestURL: string): boolean => {
  let parsed = resolveURL(requestURL)

  return parsed.protocol === originURL.protocol && parsed.host === originURL.host
}
