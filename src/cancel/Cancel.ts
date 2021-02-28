export default class Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

export const isCancel = (value: unknown): boolean => {
  return value instanceof Cancel
}
