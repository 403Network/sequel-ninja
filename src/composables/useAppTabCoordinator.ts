
import * as v from "@vue/composition-api"
import store from "@/store"
import { Tab } from "@/store/modules/tabs/contracts.ts"
import { ComponentInstance } from '@vue/composition-api/dist/component';

export default function useAppTabCoordinator(tabs: Tab[], root: ComponentInstance) {
  v.watch(() => {
    const tab: Tab | undefined = tabs.find((tab: Tab) => tab.uid === root.$route.params.uid)
    if (tab) {
      store.dispatch.tabs.changeTab(tab.uid)
    } else if (tabs.length > 0) {
      store.dispatch.tabs.changeTab(tabs[0].uid)
    } else {
      store.dispatch.tabs.createTab(null)
    }
  })
}