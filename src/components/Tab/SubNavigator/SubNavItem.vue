<template>
  <div class="subnav__item">
    <slot />
  </div>
</template>


<script lang="ts">
import * as v from '@vue/composition-api'
import store from '@/store'

interface Props {
  title: any,
}

export default v.defineComponent({
  props: {
    title: {
      type:     String,
      required: false,
    },
  } as Props,
  setup (props: Props, context: v.SetupContext) {

  },
})
</script>

<style lang="scss" scoped>
.subnav__item {
  margin: 0 0.25rem;
}
</style>
