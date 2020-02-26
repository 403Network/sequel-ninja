import Vue from "vue"
import VueRouter from "vue-router"
import Tab from "@/components/Tab/Tab.vue"
import Content from '@/components/Content/Content.vue'

Vue.use(VueRouter)

export default new VueRouter(<any>{
  routes: [
    {
      path: "/",
      name: "index",
      component: Tab,
      children: [
        {
          name: "tab-home",
          path: "/:uid",
          component: Content
        }
      ]
    }
  ]
})
