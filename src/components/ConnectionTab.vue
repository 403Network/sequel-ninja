<template>
  <router-view v-if="hasConnection"></router-view>
  <start-connection @connected="connected" :uid="uid" v-else />
</template>

<script>
import StartConnection from './StartConnection'

export default {
  components: {
    StartConnection
  },
  computed: {
    hasConnection () {
      return this.db && Boolean(this.db.connection)
    },
    db () {
      return this.$store.state.tabs.tabs.find(tab => tab.uid === this.uid)
    },
    uid () {
      return this.$store.state.tabs.selectedTabUid
    }
  },
  methods: {
    connected () {
    },
  },
  mounted () {

  }
}
</script>
