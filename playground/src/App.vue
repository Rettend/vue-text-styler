<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { TextStylerProps } from 'vue-text-styler'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const keys = ref(['text-red-6 dark:text-red-5 font-bold', 'underline'])
const values = ref(['text1', 'text2'])

const keysComputed = computed({
  get: () => keys.value.join(', '),
  set: (value: string) => keys.value = value.split(',').map(key => key.trim()),
})

const valuesComputed = computed({
  get: () => values.value.join(', '),
  set: (value: string) => values.value = value.split(',').map(key => key.trim()),
})

interface ExampleHelper {
  tracked?: string[]
  info: string
}

type Example = TextStylerProps & ExampleHelper

const examples = reactive<Example[]>([
  {
    info: 'Most basic example',
    text: 'I am red!',
    special: {
      'text-red-6 dark:text-red-5 font-bold': 'red',
    },
  },
  {
    info: 'Readonly',
    text: 'You cannot edit me!',
    special: {
      'text-red-6 dark:text-red-5 font-bold': 'cannot',
    },
    readonly: true,
  },
  {
    info: 'Single line',
    text: 'text1 and text2 are here',
    special: {
      'text-red-6 dark:text-yellow-5 font-bold': ['text1', 'text2'],
      'underline': 'here',
    },
    line: 'single',
  },
  {
    info: 'With tracking',
    text: 'text1 and text2 are here',
    special: {
      'text-red-6 dark:text-red-5 font-bold': ['text1', 'text2'],
      'underline': 'here',
    },
    track: ['text1', 'text2'],
    tracked: [],
  },
  {
    info: 'Dynamic special keys (only works with already generated css 😑)',
    text: keysComputed.value,
    special: {},
  },
  {
    info: 'Dynamic special values',
    text: valuesComputed.value,
    special: {},
  },
  {
    info: 'Dynamic playground (change input to update 😪)',
    text: 'text1 and text2 are here',
    special: Object.fromEntries(keys.value.map((key, index) => [key, values.value[index]])),
  },
])

const exampleSet = new Map<string, string>()

watch(examples, () => {
  keysComputed.value = examples[examples.length - 3].text
  valuesComputed.value = examples[examples.length - 2].text

  if (exampleSet.has(keysComputed.value) && exampleSet.get(keysComputed.value) === valuesComputed.value)
    return

  exampleSet.clear()

  examples[examples.length - 1].special = Object.fromEntries(keys.value.map((key, index) => [key, values.value[index]]))
  exampleSet.set(keysComputed.value, valuesComputed.value)
})

function exampleView(example: Example) {
  const helper: ExampleHelper = {
    info: example.info,
    tracked: example.tracked,
  }

  const props = Object.fromEntries(Object.entries(example).filter(([key]) => !(key in helper)))
  return JSON.stringify(props, null, 2)
}

function handleEnter(e: KeyboardEvent, index: number) {
  if (examples[index].line === 'single')
    e.preventDefault()
}
</script>

<template>
  <div flex="~ col" font-sans p-3 gap-4>
    <div flex="~ row" justify-between mb-4>
      <div>
        <h1>TextStyler Playground</h1>
        <div flex="~ row" gap-2 items-center>
          <div i-shadow:ph-info-bold w-8 h-8 text-blue-6 />
          Change the inputs' values and the styling will be updated.
        </div>
      </div>
      <div
        w-10 h-10 cursor-pointer mt-6 text-red-6 dark:text-red-5 :class="isDark ? 'i-shadow:ph-moon-bold md:mr-2' : 'i-shadow:ph-sun-bold'"
        @click="toggleDark()"
      />
    </div>
    <div v-for="(example, index) in examples" :key="index" flex="~ col md:row" gap-2>
      <div flex-1 bg-gray-1 dark:bg-dark-4 rounded-xl p-3 w="auto md:1" justify-between>
        <h2>{{ index + 1 }}. {{ example.info }}</h2>
        <TextStyler
          v-model:text="example.text"
          :special="example.special"
          :track="example.track"
          :line="example.line"
          :readonly="example.readonly"
          p-3 bg-gray-2 dark:bg-dark-3 rounded-xl
          @tracked="example.tracked = $event"
          @keydown.enter="handleEnter($event, index)"
        />
        <p>
          {{ example.tracked }}
        </p>
      </div>
      <pre w="1/2">{{ exampleView(example) }}</pre>
    </div>
  </div>
</template>
