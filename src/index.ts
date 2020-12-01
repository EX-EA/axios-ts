import { AxiosRequestConfig } from '../types'
import { buildURL } from './helpers/buildURL'
import { transformRequest } from './helpers/data'
import xhr from './xhr'

const axios = (config: AxiosRequestConfig) => {
  processConfig(config)
  xhr(config)

  // const promise = new Promise<any>(() => {})
  // return promise
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config)
  config.data = transformRequestData(config)
}

const transformURL = (config: AxiosRequestConfig): string => {
  const { url, params } = config

  return buildURL(url, params)
}

const transformRequestData = (config: AxiosRequestConfig): string => {
  return transformRequest(config.data)
}

export default axios
