import Vue from "vue"
import VueX from "vuex"
import { createDirectStore } from "direct-vuex"
import tabs from "@/store/modules/tabs"

const { store, rootActionContext, moduleActionContext } = createDirectStore((vuex: any) => Vue.use(vuex),{
  modules: {
    tabs
  }
} as any)

export default store

export { rootActionContext, moduleActionContext }

export type AppStore = typeof store
declare module "vuex" {
  interface Store<S> {
    direct: AppStore;
  }
}
