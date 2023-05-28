import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { type VueWrapper, mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import Input, { type Expose, type Props } from '../src/Input.vue'

// export interface Props {
//   text: string
//   special: Record<string, string | string[] | RegExp | RegExp[]>
//   line?: 'single' | 'multiple'
//   track?: string | string[]
//   readonly?: boolean
// }

describe('Input', () => {
  let wrapper: VueWrapper<ComponentPublicInstance<Props, Expose>>

  beforeEach(() => {
    wrapper = mount(Input, {
      attachTo: document.body,
      props: {
        text: 'test text2 test3',
        special: {
          'test-class': ['test', 'test2'],
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render correctly', () => {
    expect(wrapper.html()).toContain('test-class')
  })

  it('should update the text when the prop changes', async () => {
    await wrapper.setProps({ text: 'new text' })
    expect(wrapper.find('div').text()).toBe('new text')
  })

  it('should work with RegExp', async () => {
    await wrapper.setProps({
      text: 'test1 test2 test3 test4',
      special: {
        'test-class': /test1/,
        'test-class-3': [/test2/, /test3/],
      },
    })

    expect(wrapper.html()).toContain('test-class')
    expect(wrapper.html()).toContain('test-class-3')
  })

  it('should focus the div when focus() is called', () => {
    const div = wrapper.find('div')
    wrapper.vm.focus()

    const range = document.createRange()
    range.selectNodeContents(div.element)
    range.collapse(false)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)

    expect(div.element).toBe(document.activeElement)
  })
})
