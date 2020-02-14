import Vue from 'vue'
import VueRouter from 'vue-router'
import ConnectionTab from './components/ConnectionTab'
import ContentTab from './components/ContentTab'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: ConnectionTab,
      children: [
        {
          name: 'tab-home',
          path: '/:uid',
          component: ContentTab,
        }
      ]
    },
  ]
})