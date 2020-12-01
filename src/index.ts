import { AxiosRequestConfig } from '../types'
import { buildURL } from './helpers/buildURL'
import xhr from './xhr'

const axios = (config: AxiosRequestConfig): void => {
  processConfig(config)
  xhr(config)
}

const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config)
}

const transformURL = (config: AxiosRequestConfig): string => {
  const { url, params } = config

  return buildURL(url, params)
}

export default axios
