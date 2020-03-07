import Vue from 'vue'
import VueRouter from 'vue-router'
import Tab from '@/components/Tab/Tab.vue'
import Content from '@/components/Content/Content.vue'

Vue.use(VueRouter)

export default new VueRouter(<any>{
  routes: [
    {
      path:      '/',
      name:      'index',
      component: Tab,
      children:  [
        {
          name:      'tab-content',
          path:      '/:uid',
          component: Content,
        },
        {
          name:      'tab-structure',
          path:      '/:uid/structure',
          component: Content,
        },
        {
          name:      'tab-relations',
          path:      '/:uid/relations',
          component: Content,
        },
        {
          name:      'tab-triggers',
          path:      '/:uid/triggers',
          component: Content,
        },
        {
          name:      'tab-tableinfo',
          path:      '/:uid/tableinfo',
          component: Content,
        },
        {
          name:      'tab-query',
          path:      '/:uid/query',
          component: Content,
        },
      ],
    },
  ],
})
