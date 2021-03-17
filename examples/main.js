import Vue from 'vue'
import App from './App.vue'
import store from './store'

import loggingChart from '../packages/index'
Vue.use(loggingChart, {store})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
