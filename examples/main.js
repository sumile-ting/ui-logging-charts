import Vue from 'vue'
import App from './App.vue'
import loggingChart from '../packages/index'
Vue.use(loggingChart)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
