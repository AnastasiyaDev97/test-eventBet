import { createApp } from 'vue'
import App from './app/App.vue'
import { router } from './app/router'
import { tokenManager } from './app/providers/container'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { errorHandler } from './shared/utils/errorHandler'

tokenManager.init()

const app = createApp(App)

errorHandler.setupGlobalErrorHandler(app)

app.component('RecycleScroller', RecycleScroller)

app.use(router)

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info)
}

app.mount('#app')
