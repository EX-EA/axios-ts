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
  url?: string
  method?: RequestMethod
  params?: any
  data?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number

  [propName: string]: any
}

export interface AxiosResponse<T = any> {
  status: number
  statusText: string
  data: T
  headers: any
  request: XMLHttpRequest
  config: AxiosRequestConfig
}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}
export interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolveFn<T>, rejected?: RejectFn): number

  eject(id: number): void
}

export interface ResolveFn<T> {
  (config: T): T | Promise<T>
}

export interface RejectFn {
  (error: any): any
}
