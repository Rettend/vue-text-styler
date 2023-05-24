import 'virtual:uno.css'

import { createApp } from 'vue'
import TextStyler from 'vue-text-styler'
import App from './App.vue'

const app = createApp(App)
app.use(TextStyler)

app.mount('#app')
