<script setup lang="ts">
import { ref } from 'vue'

const text = ref('text1 and text2 are here')

const special = {
  'text-red-600 font-bold': ['text1', 'text2'],
  'underline': 'here',
}

const tracked = ref<string[]>([])
</script>

<template>
  <div font-sans>
    <h1>TextStyler Playground</h1>
    <TextStyler
      v-model:text="text"
      line="single"
      :special="special"
      :track="['text2', 'text1']"
      p-3 bg-gray-100 rounded-xl
      @tracked="tracked = $event"
      @keydown.enter.prevent
    />
    <p>
      {{ tracked }}
    </p>
  </div>
</template>
