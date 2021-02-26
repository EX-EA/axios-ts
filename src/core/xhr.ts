import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, data = null, method = 'get', headers, responseType, timeout, cancelToken } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    // Set request timeout in MS
    if (timeout) {
      request.timeout = timeout
    }

    request.open(method, url!, true)
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4 || request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== `text` ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        headers: responseHeaders,
        statusText: request.statusText,
        status: request.status,
        request,
        config,
      }

      handleResponse(response)
    }
    request.onerror = function handleError() {
      createError(`Network Error`, config, undefined, request)
    }
    request.ontimeout = function fn() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, `ECONNABORTED`, request))
    }

    Object.keys(headers).forEach((header) => {
      if (data === null && header.toLowerCase() === 'content-type') {
        delete headers[header]
      } else {
        request.setRequestHeader(header, headers[header])
      }
    })

    if (cancelToken) {
      cancelToken.promise.then((reason) => {
        request.abort()
        reject(reason)
      })
    }

    request.send(data)

    const handleResponse = (response: AxiosResponse) => {
      const { status } = response

      if (status >= 200 && status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${status}`,
            config,
            undefined,
            request,
            response
          )
        )
      }
    }
  })
}
