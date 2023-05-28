import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useChildWithCursor } from '../../src/composables'

const html = `
  <div>
    <p>foo</p>
    <p>bar</p>
    <p>baz</p>
  </div>
`

describe('useChildWithCursor', () => {
  let div: HTMLDivElement

  beforeEach(() => {
    div = document.createElement('div')
    div.innerHTML = html
    document.body.appendChild(div)
  })

  afterEach(() => {
    document.body.removeChild(div)
  })

  it('should return the correct text node and relative cursor position', () => {
    const p = div.querySelector('p:nth-child(2)') as HTMLElement
    const cursorPosition = 2
    const range = new Range()
    range.setStart(p.firstChild as Node, cursorPosition)
    range.setEnd(p.firstChild as Node, cursorPosition)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)

    const { textNode, relativeCursorPosition } = useChildWithCursor(p, cursorPosition)

    expect(textNode?.textContent).toBe('bar')
    expect(relativeCursorPosition).toBe(2)
  })

  it('should return the first text node if the cursor position is 0', () => {
    const p = div.querySelector('p:nth-child(2)') as HTMLElement
    const cursorPosition = 0
    const { textNode, relativeCursorPosition } = useChildWithCursor(p, cursorPosition)
    expect(textNode?.textContent).toBe('bar')
    expect(relativeCursorPosition).toBe(0)
  })

  it('should return undefined if the cursor position is greater than the total text content', () => {
    const p = div.querySelector('p:nth-child(2)') as HTMLElement
    const cursorPosition = 10
    const { textNode, relativeCursorPosition } = useChildWithCursor(p, cursorPosition)
    expect(textNode).toBeUndefined()
    expect(relativeCursorPosition).toBe(0)
  })
})
