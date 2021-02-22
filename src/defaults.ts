import { AxiosRequestConfig } from 'types'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

const defaults: AxiosRequestConfig = {
  method: 'GET',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },
  transformRequest: [
    function (data: any, headers: any) {
      processHeaders(headers, data)
      return transformRequest(data)
    },
  ],
  transformResponse: [
    function (data: unknown) {
      return transformResponse(data)
    },
  ],
}

const methodsNoData = [`delete`, `get`, `head`, `options`]
methodsNoData.forEach((method) => {
  defaults.headers[method] = {}
})

const methodsWithData = [`post`, `put`, `patch`]
methodsWithData.forEach((method) => {
  defaults.headers[method] = {
    'Content-Type': `application/x-www-form-urlencoded`,
  }
})

export default defaults
