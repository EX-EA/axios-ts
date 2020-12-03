import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve) => {
    const { url, data = null, method = 'get', params, headers, responseType } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method, url, true)
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
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
      resolve(response)
    }

    Object.keys(headers).forEach((header) => {
      if (data === null && header.toLowerCase() === 'content-type') {
        delete headers[header]
      } else {
        request.setRequestHeader(header, headers[header])
      }
    })
    request.send(data)
  })
}
