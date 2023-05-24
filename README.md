# vue-text-styler

[Demo](https://vue-text-styler.netlify.app/)

## Install

```bash
npm i vue-text-styler
```

```bash
yarn add vue-text-styler
```

```bash
pnpm i vue-text-styler
```

```ts
// main.ts
import TextStyler from 'vue-text-styler'

app.use(TextStyler)
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const text = ref('text1 and text2 are here')

const special = {
  'text-red-600 font-bold': ['text1', 'text2'],
  'underline': 'here',
}
</script>

<template>
  <TextStyler
    v-model:text="text"
    :special="special"
    p-3 bg-gray-100 rounded-xl
  />
</template>
```

> **Note:** find more examples in the demo/playground

<!-- const props = withDefaults(defineProps<{
  text: string
  line?: 'single' | 'multiple'
  special: Record<string, string | string[]>
  track?: string | string[]
  readonly?: boolean
}>(), {
  line: 'multiple',
}) -->

## Props

