import { AxiosRequestConfig } from 'types'

const defaultStrategy = (val1: unknown, val2: unknown) => {
  return typeof val2 !== `undefined` ? val2 : val1
}

const getVal2Strategy = (val1: unknown, val2: unknown) => {
  return typeof val2 !== `undefined` && val2
}

const stratMap = Object.create(null)

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  let config = Object.create(null)
  let valueFromConfig2Key = [`url`, `method`, `data`]
  config2 = config2 || {}

  const mergeField = (key: string) => {
    const strategy = stratMap[key] || defaultStrategy
    config[key] = strategy(config1[key], config2![key])
  }

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
