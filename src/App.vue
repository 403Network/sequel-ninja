<template>
  <div id="app">
    <header>
      <div>Sequel Ninja</div>
      <tab-menu></tab-menu>
    </header>
    <router-view class="router-view"></router-view>
    <ul v-for="(result, index) in sortedResults" :key="index">
        <li>{{ result }}</li>
    </ul>
  </div>
</template>

<script>
import TabMenu from './components/TabMenu.vue'
import { mapActions } from 'vuex'
import Mousetrap from 'mousetrap'

export default {
  name: 'App',
  data () {
    return {
      connection: null,
      sortedResults: []
    }
  },
  components: {
    TabMenu,
  },
  computed: {
    tabs () {
     return this.$store.state.tabs.tabs
    }
  },
  methods: {
    ...mapActions('tabs', ['createTab', 'changeTab', 'closeSelectedTab']),
    addListeners () {
      Mousetrap.bind(['meta+t'], () => {
        this.createTab()
      })
      Mousetrap.bind(['meta+w'], (e) => {
        if (this.tabs.length > 1) {
          e.preventDefault()
          this.closeSelectedTab()
        }
      })
      
      Mousetrap.bind(['meta+1', 'meta+2', 'meta+3', 'meta+4', 'meta+5', 'meta+6', 'meta+7', 'meta+8', 'meta+9', 'meta+0'], e => {
        let tab
        if (e.key == 0) {
          console.log('here')
          tab = this.tabs[this.tabs.length - 1]
        } else {
          tab = this.tabs[e.key - 1]
        }
        if (tab) {
          this.changeTab(tab.uid)
        }
      })
    },
    removeListeners () {

    },
    stop
  },
  watch: {
    '$route.params.uid': {
      immediate: true,
      async handler (to) {
        const tab = this.tabs.find(tab => tab.uid === to)
        if (tab) {
          this.changeTab(to.uid)
        } else if (this.tabs.length > 0) {
          this.changeTab(this.tabs[0].uid)
        } else {
          const uid = await this.createTab()
          this.$router.replace({ name: 'tab-home', params: { uid }})
          this.$router.replace('/')
        }
      }
    }
  },
  async mounted () {
    this.addListeners()
    if (this.tabs.length === 0) {
      const tabUid = await this.createTab()
      this.changeTab(tabUid)
    }
  },
  beforeDestroy () {
    this.removeListeners()
  }
}
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
</style>
