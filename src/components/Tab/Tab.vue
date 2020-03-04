<template>
  <router-view v-if="state.hasConnection" />
  <start-connection v-else :uid="state.uid" />
</template>

<script lang="ts">
import StartConnection from '@/components/Tab/StartConnection.vue'
import store from '@/store'
import * as v from '@vue/composition-api'
import { ReactiveState } from '@/contracts/ComponentStates'
import { Tab } from '@/store/modules/tabs/contracts'

export default v.defineComponent({
  components: {
    StartConnection,
  },
  setup () {
    const state: any = v.reactive({
      uid:           v.computed(() => store.state.tabs.selectedTabUid),
      tab:           v.computed(() => store.state.tabs.tabs.find((tab: Tab) => tab.uid === state.uid)),
      hasConnection: v.computed(() => state.tab && state.tab.connection.hasConnection && state.tab.connection.hasConnection),
    }) as ReactiveState

    return {
      state,
    }
  },
})
</script>
