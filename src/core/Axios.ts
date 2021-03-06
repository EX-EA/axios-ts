import {
  Axios as IAxios,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  ResolveFn,
  RejectFn,
} from '../../types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectFn
}

export default class Axios implements IAxios {
  interceptors: Interceptors
  defaults: AxiosRequestConfig

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === `string`) {
      config[`url`] = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)

    // interceptors 链表结构
    /**
     * send request
     * reqInterceptor2 -> reqInterceptor1 -> send request -> resInterceptor1 -> resInterceptor2
     */
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ]

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor)
    })

    // 实现链式调用
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!

      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData(`get`, url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData(`delete`, url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData(`head`, url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData(`options`, url, config)
  }

  post(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData(`post`, url, data, config)
  }

  put(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData(`put`, url, data, config)
  }

  patch(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData(`patch`, url, data, config)
  }

  getUri(config: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  _requestWithoutData(method: string, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      })
    )
  }

  _requestWithData(
    method: string,
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        data,
        url,
      })
    )
  }
}
