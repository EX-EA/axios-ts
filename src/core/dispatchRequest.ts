import { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../../types'
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import xhr from './xhr'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(
    (res) => {
      return transformResponseData(res)
    },
    (e: AxiosError) => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }

      return Promise.reject(e)
    }
  )
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export const transformURL = (config: AxiosRequestConfig): string => {
  let { url, params, paramsSerializer, baseURL } = config

  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }

  return buildURL(url!, params, paramsSerializer)
}

const transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transform(res.data, res.headers, res.config.transformResponse!)

  return res
}

const throwIfCancellationRequested = (config: AxiosRequestConfig) => {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
