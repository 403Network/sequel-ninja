<template>
  <transition-group tag="ul" class="tab-nav" name="fade">
    <li v-for="tab in state.tabs" :key="tab.uid" :class="tabClasses(tab)" class="tab-nav__tab" :disabled="tab.disabled !== false" @click="changeTab(tab.uid)">
      <div class="tab-nav__link">
        <span class="tab-nav__tab-wrap">{{ tab.name }} </span>
      </div>
      <close-tab v-if="state.showCloseBtn" :tab="tab">X</close-tab>
    </li>
    <li key="newTab" class="tab-nav__tab tab-nav__tab--new-tab" @click="createTab">
      +
    </li>
  </transition-group>
</template>

<script>
import CloseTab from './CloseTab'
import store from '@/store'
import * as v from '@vue/composition-api'

export default {
  components: {
    CloseTab,
  },
  setup () {
    const state = v.reactive({
      disabled:       false,
      tabs:           v.computed(() => store.state.tabs.tabs),
      selectedTabUid: v.computed(() => store.state.tabs.selectedTabUid),
      showCloseBtn:   v.computed(() => store.state.tabs.tabs.length > 1),
    })

    const tabClasses = (tab) => {
        return tab.uid === state.selectedTabUid ? 'tab-nav__tab--selected' : null
    }

    return {
      state,
      // methods
      tabClasses,
      changeTab: store.dispatch.tabs.changeTab,
      createTab: store.dispatch.tabs.createTab,
    }
  },
}
</script>

<style scoped lang="scss">
.tab-nav {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  user-select: none;
  overflow: hidden;
  width: 100%;
  padding-left: 4px;
}
.tab-nav__tab {
  flex-grow: 1;
  font-size: 0.9rem;
  flex: 1;
  cursor: default;
  overflow: hidden;
  position: relative;
  transition: flex-grow 0.5s ease-out, background 0.5s ease-out;
}
.tab-nav__tab:not(:last-child) {
  border-radius: 0.25em 0.25em 0 0;
  z-index: 2;
}

.tab-nav__tab--selected,
.tab-nav__tab--selected:not(:last-child) {
  background: white;
  z-index: 3;
}
.tab-nav__tab--new-tab {
  max-width: 36px;
  min-width: 36px;
  line-height: 36px;
  border-radius: 0.5rem;
  height: 36px;
  font-size: 1.5rem;
  transform: scale(0.8);
}
.tab-nav__tab--new-tab:hover {
  background: #dcdcdc;
}
.tab-nav__tab--new-tab:active {
  background: #c6c6c6;
}
.tab-nav__tab-wrap {
  min-width: 100px;
  text-align: center;
  display: block;
  transform: translate(-50%, 0);
  position: absolute;
  left: 50%;
}

.tab-nav__link {
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
