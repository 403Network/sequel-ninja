<template>
  <div class="toolbar">
    <div class="toolbar-slot toolbar-slot--left" />
    <div class="toolbar-slot toolbar-slot--right">
      <slot name="right" />
    </div>
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
  height: $toolbar-height;
  line-height: $toolbar-height;
  box-shadow: 0px 0px 8px -5px black;
  border-top: 1px solid $toolbar-border-color;
  background: linear-gradient(to bottom, white, #eaeaea, #ffffff);
  z-index: 1;
  position: relative;
  display: flex;
}
.toolbar-slot {
  flex-grow: 1;
  width: 50%;
  padding: 0 1rem;
  &--left {

  }
  &--right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

