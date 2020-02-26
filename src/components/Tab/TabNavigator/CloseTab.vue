<template>
  <div
    v-if="!isDisabled"
    class="tab-nav__tab-close"
    :class="closeBtnClasses"
    @click.stop.prevent="close(tab.uid)"
  >
    X
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: ["tab"],
  data() {
    return {
      isDisabled: false
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
        ? "tab-nav__tab-close--selected"
        : null
    }
  },
  methods: {
    ...mapActions("tabs", ["closeTab"]),
    close(uid) {
      if (this.isDisabled) {
        return
      }
      this.isDisabled = true
      this.$nextTick(() => {
        this.closeTab(uid)
      })
    }
  }
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
