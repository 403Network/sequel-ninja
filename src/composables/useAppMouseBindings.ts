import Mousetrap from "mousetrap"
import store from "@/store"
import { Tab } from "@/store/modules/tabs/contracts"
import * as v from "@vue/composition-api"

export default function useAMouseBindings(tabs: Tab[]) {
  const newTab = {
    action: "newTab",
    binding: "meta+t",
    handler: (e: ExtendedKeyboardEvent): any => {
      if (tabs.length === 0) return
      store.dispatch.tabs.createTab(null)
    }
  }

  const closeTab = {
    action: "closeTab",
    binding: "meta+w",
    handler: (e: any): any => {
      if (tabs.length === 1) return
      e.preventDefault()
      store.dispatch.tabs.closeSelectedTab(null)
    }
  }

  const switchTab = {
    action: "switchTab",
    binding: [
      "meta+1",
      "meta+2",
      "meta+3",
      "meta+4",
      "meta+5",
      "meta+6",
      "meta+7",
      "meta+8",
      "meta+9",
      "meta+0"
    ],
    handler: (e: any): any => {
      e.preventDefault()
      const tabKey = e.key === 0 ? tabs.length - 1 : e.key - 1
      if (tabs[tabKey]) {
        store.dispatch.tabs.changeTab(tabs[tabKey].uid)
      }
    }
  }

  v.onMounted(() => {
    Mousetrap.bind(newTab.binding, newTab.handler)
    Mousetrap.bind(closeTab.binding, closeTab.handler)
    Mousetrap.bind(switchTab.binding, switchTab.handler)
  })

  v.onBeforeUnmount(() => {
    Mousetrap.unbind(newTab.binding)
    Mousetrap.unbind(closeTab.binding)
    Mousetrap.unbind(switchTab.binding)
  })
}
