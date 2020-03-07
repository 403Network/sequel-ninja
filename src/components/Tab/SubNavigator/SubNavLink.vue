<template>
  <router-link
    :to="item.to"
    class="subnav__link"
    exact-active-class="subnav__link--selected"
    :class="[item.class, { disabled: isDisabled(item) }]"
  >
    <font-awesome-icon :icon="item.icon" :size="item.size" />
    <span v-text="item.title" />
  </router-link>
</template>

<script lang="ts">
import * as v from '@vue/composition-api'
import store from '@/store'

export default v.defineComponent({
  props: {
    item: {
      required: true,
    },
  },
  setup (props: any, context: v.SetupContext) {
    const isDisabled = (item: any) => {
      const r = context.root.$router.resolve(item.to).resolved.meta.disabled
      console.log(r)
      return r
    }

    const check = () => false

    return {
      isDisabled,
      check,
    }
  },
})
</script>
<style lang="scss" scoped>
.subnav__link {
  margin: 0;
  padding: 0.6rem 0.6rem 0.3rem;
  display: block;
  text-align: center;
  text-decoration: none;
  color: inherit;
  border-radius: 0.4rem;
  color: rgba(0,0,0,0.3);
  background-color: rgba(0,0,0,0);
  transition: background-color 0.2s, color 0.2s;
  font-size: 0.85rem;
  &:active, &--selected {
    background: rgba(0,0,0,0.05);
    color: $highlight-color;
  }
  &.disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.3;
  }
  svg {
    display: inline-block;
  }
  span {
    display: block;
    margin-top: 0.4rem;
    font-size: 0.85rem;
  }
}
</style>
