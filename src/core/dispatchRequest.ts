import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../../types'
import { buildURL } from '../helpers/url'
import xhr from './xhr'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((res) => {
    return transformResponseData(res)
  })
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  config.headers = flattenHeaders(config.headers, config.method!)
}

const transformURL = (config: AxiosRequestConfig): string => {
  const { url, params } = config

  return buildURL(url!, params)
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
