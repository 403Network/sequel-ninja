<template>
  <router-view v-if="state.hasConnection"></router-view>
  <start-connection :uid="state.uid" v-else />
</template>

<script>
import StartConnection from "./StartConnection"
import store from '@/store'
import * as v from '@vue/composition-api'

export default {
  components: {
    StartConnection
  },
  setup() {
    const state = v.reactive({
      uid: v.computed(() => store.state.tabs.selectedTabUid),
      tab: v.computed(() => store.state.tabs.tabs.find(tab => tab.uid === state.uid)),
      hasConnection: v.computed(() => state.tab && state.tab.connection.hasConnection())
    })

    return {
      state,
    }
  },
}
</script>
