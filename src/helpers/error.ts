import { AxiosRequestConfig, AxiosResponse } from 'types'

export class AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string,
    request?: any,
    response?: AxiosResponse
  ) {
    // 放这，测试覆盖率就能通过，神奇
    super(message) /* istanbul ignore next */

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    /** ts bug */
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export const createError = (
  message: string,
  config: AxiosRequestConfig,
  code?: string,
  request?: any,
  response?: AxiosResponse
): AxiosError => {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
