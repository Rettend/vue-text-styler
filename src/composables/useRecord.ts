import type { Props } from '../Input.vue'

export function useRecord() {
  function isString(value: Props['special']): value is Record<string, string | string[]> {
    return Object.values(value).every(v => typeof v === 'string' || Array.isArray(v))
  }

  function isRegExp(value: Props['special']): value is Record<string, RegExp | RegExp[]> {
    return Object.values(value).every(v => v instanceof RegExp || Array.isArray(v))
  }

  return {
    isString,
    isRegExp,
  }
}
