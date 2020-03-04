<template>
  <div
    v-if="!state.isDisabled"
    class="tab-nav__tab-close"
    :class="state.closeBtnClasses"
    @click.stop.prevent="close(tab.uid)"
  >
    X
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import * as v from '@vue/composition-api'
import store from '@/store'
import { Tab } from '@/store/modules/tabs/contracts';

export default v.defineComponent({
  setup (props: { tab: Tab }, ctx: v.SetupContext) {
    const state: any = v.reactive({
      isDisabled: false,
      tabs: v.computed(() => store.state.tabs.tabs),
      selectedTabUid: v.computed(() => store.state.tabs.selectedTabUid),
      closeBtnClasses: v.computed(() => state.selectedTabUid === props.tab.uid ? 'tab-nav__tab-close--selected' : null),
    })

    const closeTab = (uid: string) => store.dispatch.tabs.closeTab(uid)

    const close = (uid: string) => {
      if (state.isDisabled) return
      state.isDisabled = true
      ctx.root.$nextTick(() => closeTab(uid))
    },

    return {
      state,
      close
    }
  },
  props: ['tab'],
  data() {
    return {
      isDisabled: false,
    }
  },
  computed: {
    tabs() {
      return this.$store.state.tabs.tabs
    },
    selectedTabUid() {
      return this.$store.state.tabs.selectedTabUid
    },
    closeBtnClasses() {
      return this.selectedTabUid === this.tab.uid
        ? 'tab-nav__tab-close--selected'
        : null
    },
  },
  methods: {
    ...mapActions('tabs', ['closeTab']),
  },
}
</script>

<style>
.tab-nav__tab:hover .tab-nav__tab-close {
  opacity: 1
  /* background: #efefef */
}
.tab-nav__tab-close {
  border-radius: 0.25em;
  position: absolute;
  z-index: 4;
  right: 0.5em;
  top: 50%;
  transform: translate(0, -50%);
  border: 0;
  width: 22px;
  height: 22px;
  text-align: center;
  padding: 0;
  line-height: 22px;
  outline: none;
  opacity: 0;
  transition: opacity 0.2s ease-in, box-shadow 0.2s, background 0.2s;
}
.tab-nav__tab-close--selected {
  background: white;
}

.tab-nav__tab-close:hover {
  background: #dcdcdc;
}

.tab-nav__tab-close:active {
  background: #c6c6c6;
}
</style>
