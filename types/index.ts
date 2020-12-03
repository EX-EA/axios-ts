type RequestMethod =
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'put'
  | 'PUT'
  | 'get'
  | 'GET'
  | 'head'
  | 'Head'
  | 'options'
  | 'OPTIONS'

export interface AxiosRequestConfig {
  url: string
  method?: RequestMethod
  params?: any
  data?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
}

export interface AxiosResponse {
  status: number
  statusText: string
  data: XMLHttpRequestResponseType
  headers: any
  request: XMLHttpRequest
  config: AxiosRequestConfig
}

export interface AxiosPromise extends Promise<AxiosResponse> {}
