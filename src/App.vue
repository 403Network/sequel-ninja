<template>
  <div id="app">
    <header>
      <div>Sequel Ninja</div>
      <tab-menu />
    </header>
    <transition name="fade">
      <router-view class="router-view" />
    </transition>
  </div>
</template>

<script lang="ts">
import TabMenu from "@/components/TabMenu.vue"
import * as v from "@vue/composition-api"
import store from "@/store"
import { Tab } from "@/store/modules/tabs/contracts.ts"
import useAppMouseBindings from "@/composables/useAppMouseBindings"
import useAppTabCoordinator from "@/composables/useAppTabCoordinator"
import { ReactiveState } from '@/contracts/ComponentStates'
import { Route } from 'vue-router'
import { remote } from 'electron'

let rightClickPosition: any = null

const menu = new remote.Menu()
const menuItem = new remote.MenuItem({
  label: 'Inspect Element',
  click: () => {
    remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
  }
})
menu.append(menuItem)

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  rightClickPosition = {x: e.x, y: e.y}
  menu.popup(remote.getCurrentWindow())
}, false)




export default v.createComponent({
  name: "App",
  components: {
    TabMenu
  },
  setup(props, { root }: v.SetupContext) {
    const state = v.reactive({
      tabs: v.computed(() => store.state.tabs.tabs)
    }) as ReactiveState

    useAppTabCoordinator(state.tabs, root)
    useAppMouseBindings(state.tabs as Tab[])
  }
})
</script>

<style scoped>
header {
  background: linear-gradient(to bottom, rgba(238, 238, 238, 1), #ecebeb);
}
header > div {
  -webkit-app-region: drag;
  height: 22px;
  line-height: 22px;
}
</style>

<style>
* {
  box-sizing: border-box;
}
html {
  font-size: 10pt;
  height: 100%;
}
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.router-view {
  padding: 0.75rem 0 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.router-view--flex {
  flex-direction: row;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.32s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
