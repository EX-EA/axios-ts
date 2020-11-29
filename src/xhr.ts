import { AxiosRequestConfig } from '../types'

export default function xhr(config: AxiosRequestConfig): void {
  const { url, data = null, method = 'get', params } = config

  console.log('xhr')
  const request = new XMLHttpRequest()
  request.open(method, url, true)
  request.send(data)
}
