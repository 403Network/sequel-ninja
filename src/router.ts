import Vue from "vue"
import VueRouter from "vue-router"
import ConnectionTab from "@/components/ConnectionTab.vue"
import ContentTab from "@/components/ContentTab.vue"

Vue.use(VueRouter)

export default new VueRouter(<any>{
  routes: [
    {
      path: "/",
      name: "index",
      component: ConnectionTab,
      children: [
        {
          name: "tab-home",
          path: "/:uid",
          component: ContentTab
        }
      ]
    }
  ]
})
