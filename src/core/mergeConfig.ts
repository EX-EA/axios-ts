import { isPlainObject, deepMerge } from '../helpers/utils'
import { AxiosRequestConfig } from 'types'

const defaultStrategy = (val1: unknown, val2: unknown) => {
  return typeof val2 !== `undefined` ? val2 : val1
}

const getVal2Strategy = (_val1: unknown, val2: unknown) => {
  return typeof val2 !== `undefined` && val2
}

const deepMergeStrat = (val1: unknown, val2: unknown) => {
  if (isPlainObject(val2)) {
    return deepMerge(val1 as any, val2)
  } else if (typeof val2 !== `undefined`) {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== `undefined`) {
    return val1
  }
}

const stratMap = Object.create(null)
const valueFromConfig2Key = [`url`, `params`, `data`]
const mergeDeepPropertiesKeys = [`headers`, `auth`]

/**
 * stratMap = {
 *   url: getVal2Strategy,
 *   method: getVal2Strategy,
 *   data: getVal2Strategy
 * }
 */
valueFromConfig2Key.forEach((key) => {
  stratMap[key] = getVal2Strategy
})
mergeDeepPropertiesKeys.forEach((key) => {
  stratMap[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  let config = Object.create(null)
  config2 = config2 || {}

  const mergeField = (key: string) => {
    const strategy = stratMap[key] || defaultStrategy
    config[key] = strategy(config1[key], config2![key])
  }

  for (const key in config2) {
    if (Object.prototype.hasOwnProperty.call(config2, key)) {
      mergeField(key)
    }
  }

  for (const key in config1) {
    if (Object.prototype.hasOwnProperty.call(config1, key)) {
      if (!config2[key]) {
        mergeField(key)
      }
    }
  }

  return config
}
