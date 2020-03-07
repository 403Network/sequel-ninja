import Vue from 'vue'
import { createDirectStore } from 'direct-vuex'
import tabs from '@/store/modules/tabs'
import favourites from '@/store/modules/favourites'
import VuexPersistence from 'vuex-persist'


const vuexLocal = new VuexPersistence<any>({
  storage: window.localStorage,
  reducer: state => ({ favourites: state.favourites }),
})

const { store, rootActionContext, moduleActionContext } = createDirectStore(
  {
    modules: {
      tabs,
      favourites,
    },
    plugins: [vuexLocal.plugin],
  } as any,
  (vuex: any) => Vue.use(vuex),
)

export default store

export { rootActionContext, moduleActionContext }

export type AppStore = typeof store
declare module 'vuex' {
  interface Store<S> {
    direct: AppStore
  }
}
