import { Axios as IAxios, AxiosPromise, AxiosRequestConfig } from '../../types'
import dispatchRequest from './dispatchRequest'

export default class Axios implements IAxios {
  request(url: string | AxiosRequestConfig, config: AxiosRequestConfig = {}): AxiosPromise {
    if (typeof url === `string`) {
      config[`url`] = url
    } else {
      config = url
    }

    return dispatchRequest(config)
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
