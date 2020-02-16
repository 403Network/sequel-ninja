import Vue from 'vue'
import VueX from 'vuex'
import VueColumnsResizable from 'vue-columns-resizable'
import store from './store'
import router from './router'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api'

Vue.config.productionTip = false

Vue.use(VueColumnsResizable)
Vue.use(VueCompositionApi)

new Vue({
  render: h => h(App),
  store: store.original,
  router
}).$mount("#app")
