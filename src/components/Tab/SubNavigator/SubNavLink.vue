<template>
  <router-link :to="item.to" class="subnav__link" exact-active-class="subnav__link--selected">
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
