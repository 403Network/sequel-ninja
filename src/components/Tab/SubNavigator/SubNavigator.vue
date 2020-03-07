<template>
  <div class="subnav">
    <sub-nav-item v-for="item in navItems" :key="item.name">
      <sub-nav-link :item="item" />
    </sub-nav-item>
  </div>
</template>

<script lang="ts">
import SubNavLink from './SubNavLink.vue'
import SubNavItem from './SubNavItem.vue'
import * as v from '@vue/composition-api'
import store from '@/store'

interface NavItem {
  to: {
    name: string
  }
  icon: string
  size: string
  title: string
  class?: any
}

export default v.defineComponent({
  components: {
    SubNavItem,
    SubNavLink,
  },
  setup(props, context: v.SetupContext) {
    console.log(context.root.$router)
    const navItems: NavItem[] = [
      {
        to: {
          name: 'tab-structure',
        },
        icon:  'igloo',
        size:  '2x',
        title: 'Structure',
      },
      {
        to: {
          name: 'tab-content',
        },
        icon:  'table',
        size:  '2x',
        title: 'Content',
      },
      {
        to: {
          name: 'tab-relations',
        },
        icon:  'sitemap',
        size:  '2x',
        title: 'Relations',
      },
      {
        to: {
          name: 'tab-triggers',
        },
        icon:  'bolt',
        size:  '2x',
        title: 'Triggers',
      },
      {
        to: {
          name: 'tab-tableinfo',
        },
        icon:  'info-circle',
        size:  '2x',
        title: 'Table Info',
      },
      {
        to: {
          name: 'tab-query',
        },
        icon:  'terminal',
        size:  '2x',
        title: 'Query',
      },
    ]

    return {
      navItems,
    }
  },
})
</script>


<style lang="scss" scoped>
.subnav {
  box-shadow: 0 2px 6px -5px #6f6f6f;
  display: flex;
  padding: 0.5rem;
}
</style>
