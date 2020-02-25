import Mousetrap from "mousetrap"
import store from "@/store"
import { Tab } from "@/store/modules/tabs/contracts"
import * as v from "@vue/composition-api"

interface MouseBinding {
  binding: string | string[]
  handler: (e: ExtendedKeyboardEvent) => void
}

export default function useAppMouseBindings(tabs: Tab[]) {
  const newTab: MouseBinding = {
    binding: "meta+t",
    handler: (e: ExtendedKeyboardEvent): void => {
      if (tabs.length === 0) return
      store.dispatch.tabs.createTab(null)
    }
  }

  const closeTab: MouseBinding = {
    binding: "meta+w",
    handler: (e: any): void => {
      if (tabs.length === 1) return
      e.preventDefault()
      store.dispatch.tabs.closeSelectedTab(null)
    }
  }

  const switchTab: MouseBinding = {
    binding: ["meta+1", "meta+2", "meta+3", "meta+4", "meta+5", "meta+6", "meta+7", "meta+8", "meta+9", "meta+0"],
    handler: (e: any): void => {
      e.preventDefault()
      const tabKey = e.key === 0 ? tabs.length - 1 : e.key - 1
      if (tabs[tabKey]) {
        store.dispatch.tabs.changeTab(tabs[tabKey].uid)
      }
    }
  }

  const moveTabIndex: MouseBinding = {
      binding: ["up", "down"],
      handler: (e: any): void => {
        e.preventDefault()
        const sibling: HTMLElement = (e.key == "ArrowUp" ? document.activeElement.previousSibling : document.activeElement.nextSibling) as HTMLElement
        if (sibling && sibling.focus) {
          sibling.dispatchEvent(new Event('mousedown')) 
          sibling.focus()
        }
      }
  }

  v.onMounted(() => {
    Mousetrap.bind(newTab.binding, newTab.handler)
    Mousetrap.bind(closeTab.binding, closeTab.handler)
    Mousetrap.bind(switchTab.binding, switchTab.handler)
    Mousetrap.bind(moveTabIndex.binding, moveTabIndex.handler)
  })

  v.onBeforeUnmount(() => {
    Mousetrap.unbind(newTab.binding)
    Mousetrap.unbind(closeTab.binding)
    Mousetrap.unbind(switchTab.binding)
    Mousetrap.unbind(moveTabIndex.binding)
  })
}
