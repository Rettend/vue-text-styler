import { beforeEach, describe, expect, it } from 'vitest'
import { useRecord } from '../../src/composables/useRecord'

const inputString = {
  foo: 'bar',
  baz: ['qux', 'quux'],
}

const inputRegExp = {
  foo: /bar/,
  baz: [/qux/, /quux/],
}

describe('useRecord', () => {
  let isString: ReturnType<typeof useRecord>['isString']
  let isRegExp: ReturnType<typeof useRecord>['isRegExp']

  beforeEach(() => {
    const record = useRecord()
    isString = record.isString
    isRegExp = record.isRegExp
  })

  describe('isString', () => {
    it('should return true for string and string[]', () => {
      const result = isString(inputString)
      expect(result).toBe(true)
    })

    it('should return false for RegExp and RegExp[]', () => {
      const result = isString(inputRegExp)
      expect(result).toBe(false)
    })
  })

  describe('isRegExp', () => {
    it('should return true for RegExp and RegExp[]', () => {
      const result = isRegExp(inputRegExp)
      expect(result).toBe(true)
    })

    it('should return false for string and string[]', () => {
      const result = isRegExp(inputString)
      expect(result).toBe(false)
    })
  })
})
