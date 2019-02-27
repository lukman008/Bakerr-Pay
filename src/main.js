import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import '@mdi/font/css/materialdesignicons.css'


import App from './App.vue'
import router from './router'
import './registerServiceWorker'

Vue.config.productionTip = false


Vue.use(Vuetify, {
  iconfont: 'mdi',
   theme: {
    primary: '#0B141B',
    secondary: '#004346',
    accent: '#09BC8A',
    error: '#ff4d4d'
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
