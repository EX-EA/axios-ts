import { isPlainObject } from './utils'

export const transformRequest = (data: any): any => {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export const transformResponse = (data: unknown): any => {
  if (typeof data === `string`) {
    try {
      data = JSON.parse(data)
    } catch (error) {
      /* Ignore */
    }
  }
  return data
}
