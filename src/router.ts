import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router'
import Tab from '@/components/Tab/Tab.vue'
import Content from '@/components/Content/Content.vue'

Vue.use(VueRouter)

export default new VueRouter({
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
          meta:      { disabled: true },
        },
        {
          name:      'tab-relations',
          path:      '/:uid/relations',
          component: Content,
          meta:      { disabled: true },
        },
        {
          name:      'tab-triggers',
          path:      '/:uid/triggers',
          component: Content,
          meta:      { disabled: true },
        },
        {
          name:      'tab-tableinfo',
          path:      '/:uid/tableinfo',
          component: Content,
          meta:      { disabled: true },
        },
        {
          name:      'tab-query',
          path:      '/:uid/query',
          component: Content,
          meta:      { disabled: true },
        },
      ],
    },
  ],
} as RouterOptions)
