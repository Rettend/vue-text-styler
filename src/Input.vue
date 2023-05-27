<script setup lang="ts">
import { computed, h, onMounted, ref, useAttrs, watch } from 'vue'
import DOMPurify from 'isomorphic-dompurify'
import { useChildWithCursor, useCursorPosition, useRecord } from './composables'

export interface Props {
  text: string
  special: Record<string, string | string[] | RegExp | RegExp[]>
  line?: 'single' | 'multiple'
  track?: string | string[]
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  line: 'multiple',
})

const emit = defineEmits<{
  (event: 'update:text', value: string): void
  (event: 'tracked', keys: string[]): void
}>()

const attrs = useAttrs()
const record = useRecord()
const input = ref<HTMLDivElement | null>(null)
const TEXT = computed(() => DOMPurify.sanitize(props.text))

function styleSpecialValues() {
  let regex: RegExp | undefined

  if (record.isString(props.special)) {
    const keys = Object.values(props.special).flat().sort((a, b) => b.length - a.length)
    const escapedKeys = keys.map(key => key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    regex = new RegExp(escapedKeys.join('|'), 'g')
  }
  else if (record.isRegExp(props.special)) {
    const regexes = Object.values(props.special).flat().map(v => new RegExp(v.source))
    regex = new RegExp(regexes.map(r => r.source).join('|'), 'g')
  }

  if (!regex)
    return TEXT.value

  const matches = TEXT.value.match(regex)

  if (matches) {
    const tracked = matches.filter(match => props.track?.includes(match))
    if (tracked.length > 0)
      emit('tracked', tracked)
  }
  else if (props.track) {
    emit('tracked', [])
  }

  return TEXT.value.replace(regex, (match) => {
    const key = Object.keys(props.special).find((k) => {
      const values = props.special[k]
      if (typeof values === 'string') {
        return values === match
      }
      else if (values instanceof RegExp) {
        return values.test(match)
      }
      else if (Array.isArray(values)) {
        return values.some((v) => {
          if (typeof v === 'string')
            return v === match
          else if (v instanceof RegExp)
            return v.test(match)
          else
            return false
        })
      }
      else { return false }
    })
    if (key)
      return `<span class="${key}">${match}</span>`
    else
      return match
  })
}

onMounted(() => {
  const el = input.value as HTMLDivElement
  el.innerHTML = styleSpecialValues()
})

watch(() => TEXT.value, () => {
  if (!input.value)
    return

  const absoluteCursorPosition = useCursorPosition(input.value)?.[0] ?? 0

  input.value.innerHTML = styleSpecialValues()

  const sel = window.getSelection()
  const focusNode = sel?.focusNode // div (parent of text)

  const { textNode, relativeCursorPosition } = useChildWithCursor(
    focusNode as Node,
    absoluteCursorPosition,
  )

  if (TEXT.value && textNode)
    setCursorPosition(textNode, relativeCursorPosition)
})

function setCursorPosition(el: ChildNode, position: number) {
  const sel = window.getSelection()
  const range = document.createRange()
  range.setStart(el, position)
  range.setEnd(el, position)
  sel?.removeAllRanges()
  sel?.addRange(range)
}

function handleInput(e: Event) {
  const el = e.target as HTMLDivElement
  const result = el.innerHTML.replace(/<[^>]*>/g, '')
  emit('update:text', result)
}

function focus() {
  if (!input.value)
    return

  input.value.focus()

  let textNode = input.value.lastChild

  if (textNode && textNode.nodeType === 1)
    textNode = textNode.lastChild

  if (TEXT.value && textNode)
    setCursorPosition(textNode, textNode.textContent?.length ?? 0)
  else if (input.value.lastChild)
    setCursorPosition(input.value.lastChild, input.value.lastChild.textContent?.length ?? 0)
}

defineExpose({ focus })

// remove style from attrs to prevent accidental override (vue does not merge them)
const attributes = computed(() => {
  const { style, ...rest } = attrs
  return rest
})

function render() {
  return h(
    'div',
    {
      contenteditable: !props.readonly,
      ref: input,
      style: `white-space: -moz-pre-space;
      ${props.line === 'single' ? 'overflow: hidden; white-space: nowrap;' : 'white-space: pre-wrap;'}
      `,
      onInput: handleInput,
      ...attributes.value,
    },
  )
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <render />
</template>
