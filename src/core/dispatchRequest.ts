import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../../types'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import xhr from './xhr'
import { processHeaders } from '../helpers/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then((res) => {
    return transformResponseData(res)
  })
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

const transformURL = (config: AxiosRequestConfig): string => {
  const { url, params } = config

  return buildURL(url!, params)
}

const transformRequestData = (config: AxiosRequestConfig): string => {
  return transformRequest(config.data)
}

const transformHeaders = (config: AxiosRequestConfig) => {
  const { headers = {}, data } = config

  return processHeaders(headers, data)
}

const transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transformResponse(res.data)

  return res
}
