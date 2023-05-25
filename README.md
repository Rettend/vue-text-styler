# vue-text-styler

[Demo](https://vue-text-styler.netlify.app/)

## 📦 Install

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

// for global registration
app.component(TextStyler)
```

## 🧰 Props

| Name     | Type                                                                 | Default | Description                                                                                         |
| -------- | -------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `text`   | `string`                                                             |     | A string representing the text to be displayed in the component.                                     |
| `special`| `Record<string, string \| string[]>`                                 |     | An object that contains key-value pairs. The keys represent the classes that will be applied to the text that matches the value. The value can be a string or an array of strings representing the text that will be matched. |
| `line?`   | `'single' \| 'multiple'`                                             | `'multiple'`    | By default, the component acts like a textarea (though you have to use Shift+Enter). Set this prop to `'single'` to force it to display the text in a single line. You propably also want to add `@keydown.enter.prevent` or `e.preventDefault()`. |
| `track?`  | `string \| string[]`                                                 |     | A string or an array of strings from the values of `special` that will be tracked. If set, the component will emit the strings that were matched. |
| `readonly?`| `boolean`                                                           | `false` | A boolean value indicating whether the component is read-only or not. If set to `true`, the component will be read-only. |

## 📜 Events

| Name     | Type                                                                 | Description                                                                                         |
| -------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `update:text`   | `string`                                                             | Emitted when the text changes.                                     |
| `tracked`| `string[]`                                 | Emitted when the text matches any of the values of `track`. |

## 🚀 Usage

Simple example:

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

A bit more complex example, where your text is an external object:

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const text = ref('I\'m a large red circle.')

const object = reactive({
  color: 'red',
  shape: 'circle',
  size: 'large',
})

const special = computed(() => {
  return {
    'text-red-5 font-bold': object.color,
    'text-blue-5 font-bold': object.shape,
    'text-green-5 font-bold': object.size,
  }
})
</script>

<template>
  <TextStyler
    v-model:text="text"
    :special="special"
    p-3 bg-gray-100 rounded-xl
  />
</template>
```

A ridiculously complex example, where your text is an external array of objects for some unbeknownst reason:

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const text = ref('I\'m John and I\'m 20 years old.\nAnd I\'m Jane and I\'m 21 years old.')

const object = reactive([
  {
    name: 'Jane',
    age: 21,
  },
  {
    name: 'John',
    age: 20,
  },
],
)

const keyNames = {
  name: 'text-green-5 font-bold',
  age: 'text-blue-5 font-bold',
}

const special = computed(() => {
  return {
    ...object.reduce((acc, prop) => {
      // loop over the properties of prop
      for (const key in prop) {
        // use the property value as the key name
        const value = prop[key as keyof typeof prop]
        // use the key name from the keyNames object
        const keyName = keyNames[key as keyof typeof keyNames]
        // check if the key name already exists in the accumulator object
        if (acc[keyName]) {
          // append the new value to the existing array
          acc[keyName].push(value.toString())
        }
        else {
          // create a new array with the first value
          acc[keyName] = [value.toString()]
        }
      }
      return acc
    }, {} as Record<string, string[]>),
  }
})
</script>

<template>
  <TextStyler
    v-model:text="text"
    :special="special"
    p-3 bg-gray-100 rounded-xl
  />
</template>
```

> **Note**: find more examples in the demo playground

## License

MIT
