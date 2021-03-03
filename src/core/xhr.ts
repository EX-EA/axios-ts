import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '@/helpers/url'
import cookie from '@/helpers/cookie'
import { isFormData } from '@/helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      data = null,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
    } = config
    const request = new XMLHttpRequest()

    request.open(method, url!, true)

    configureRequest()
    addEvents()
    processHeaders()
    processCancel()

    request.send(data)

    function configureRequest() {
      if (responseType) {
        request.responseType = responseType
      }

      // Set request timeout in MS
      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
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

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then((reason) => {
          request.abort()
          reject(reason)
        })
      }
    }

    function processHeaders(): void {
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfToken = cookie.read(xsrfCookieName)

        if (xsrfToken && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfToken
        }
      }

      if (isFormData(data)) {
        delete headers[`Content-Type`]
      }

      Object.keys(headers).forEach((header) => {
        if (data === null && header.toLowerCase() === 'content-type') {
          delete headers[header]
        } else {
          request.setRequestHeader(header, headers[header])
        }
      })
    }

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
