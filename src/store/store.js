import Vue from 'vue'
import VueX from 'vuex'
import tabs from './modules/tabs'

Vue.use(VueX)

export default new VueX.Store({
  namespaced: true,
  modules: {
    tabs
  },
})