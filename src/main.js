import Vue from 'vue'
import VueColumnsResizable from 'vue-columns-resizable'
import store from './store/store'
import router from './router'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueColumnsResizable)

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
