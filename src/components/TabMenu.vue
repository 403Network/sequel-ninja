<template>
  <transition-group tag="ul" class="tab-menu" name="fade">
    <li v-for="tab in state.tabs" :class="tabClasses(tab)" class="tab-menu__tab" :key="tab.uid" :disabled="tab.disabled !== false" @click="changeTab(tab.uid)">
      <div class="tab-menu__link">
        <span class="tab-menu__tab-wrap">{{ tab.name }} </span>
      </div>
      <close-tab :tab="tab" v-if="state.showCloseBtn">X</close-tab>
    </li>
    <li class="tab-menu__tab tab-menu__tab--new-tab" key="tabby" @click="createTab">
      +
    </li>
  </transition-group>
</template>

<script>
import CloseTab from "./CloseTab"
import store from '@/store'
import * as v from '@vue/composition-api'

export default {
  components: {
    CloseTab,
  },
  setup () {
    const state = v.reactive({
      disabled: false,
      tabs: v.computed(() => store.state.tabs.tabs),
      selectedTabUid: v.computed(() => store.state.tabs.selectedTabUid),
      showCloseBtn: v.computed(() => store.state.tabs.tabs.length > 1),
    })

    const tabClasses = (tab) => {
        return tab.uid === state.selectedTabUid ? "tab-menu__tab--selected" : null
    }

    return {
      state,
      // methods
      tabClasses,
      changeTab: store.dispatch.tabs.changeTab,
      createTab: store.dispatch.tabs.createTab,
    }
  }
}
</script>

<style scoped>
.tab-menu {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  user-select: none;
  overflow: hidden;
  width: 100%;
  padding-left: 4px;
}
.tab-menu__tab {
  flex-grow: 1;
  font-size: 0.9rem;
  flex: 1;
  color: $test;
  cursor: default;
  overflow: hidden;
  position: relative;
  transition: flex-grow 0.5s ease-out, background 0.5s ease-out;
}
.tab-menu__tab:not(:last-child) {
  border-radius: 0.25em 0.25em 0 0;
  z-index: 2;
}

.tab-menu__tab--selected,
.tab-menu__tab--selected:not(:last-child) {
  background: white;
  z-index: 3;
}
.tab-menu__tab--new-tab {
  max-width: 36px;
  min-width: 36px;
  line-height: 36px;
  border-radius: 0.5rem;
  height: 36px;
  font-size: 1.5rem;
  transform: scale(0.8);
}
.tab-menu__tab--new-tab:hover {
  background: #dcdcdc;
}
.tab-menu__tab--new-tab:active {
  background: #c6c6c6;
}
.tab-menu__tab-wrap {
  min-width: 100px;
  text-align: center;
  display: block;
  transform: translate(-50%, 0);
  position: absolute;
  left: 50%;
}

.tab-menu__link {
  padding: 0.4rem 0;
  color: inherit;
  display: block;
  height: 100%;
  width: 100%;
  line-height: 26px;
  height: 26px;
}

.fade-enter-active,
.fade-leave-active {
  transition: flex-grow 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
  flex-grow: 0;
}

.fade-enter-to,
.fade-leave {
  flex-grow: 1;
}
</style>
