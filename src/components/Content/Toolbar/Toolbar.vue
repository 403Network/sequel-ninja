<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<script lang="ts">
import * as v from '@vue/composition-api'
import store from '@/store'

export default v.defineComponent({
  setup (props, context) {
    
  },
})
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100%;
  text-align: left;
  height: 2rem;
  line-height: 2rem;
  box-shadow: 0px 0px 8px -5px black;
  background: linear-gradient(to bottom, white, #eaeaea, #ffffff);
  z-index: 1;
  position: relative;
}

</style>

