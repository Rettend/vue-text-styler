import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useCursorPosition } from '../../src/composables'

const html = `
  <div>
    <p>foo</p>
    <p>bar</p>
    <p>baz</p>
  </div>
`

describe('useCursorPosition', () => {
  let div: HTMLDivElement
  let p: HTMLElement

  beforeEach(() => {
    div = document.createElement('div')
    div.innerHTML = html
    document.body.appendChild(div)

    p = div.querySelector('p:nth-child(2)') as HTMLElement
  })

  afterEach(() => {
    document.body.removeChild(div)
  })

  it('should return the correct cursor position', () => {
    const cursorPosition = 2
    const range = new Range()
    range.setStart(p.firstChild as Node, cursorPosition)
    range.setEnd(p.firstChild as Node, cursorPosition)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)

    const result = useCursorPosition(p)

    expect(result).toEqual([cursorPosition, cursorPosition])
  })

  it('should return undefined if the element is not selected', () => {
    const sel = window.getSelection()
    sel?.removeAllRanges()

    const result = useCursorPosition(p)

    expect(result).toBeUndefined()
  })
})
