import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'
import FontAwesomeIcon from './fontawesome'
import VueCompositionApi from '@vue/composition-api'

Vue.config.productionTip = false

Vue.use(VueCompositionApi)
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  render: h => h(App),
  store:  store.original,
  router,
}).$mount('#app')
