import type { Plugin } from 'vue'
import Input from './Input.vue'

const install: Plugin = {
  install(app) {
    app.component('TextStyler', Input)
  },
}

export default install
