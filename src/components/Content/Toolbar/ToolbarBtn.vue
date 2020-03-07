<template>
  <button class="toolbar-btn" :class="state.classes" v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>

<script lang="ts">
import * as v from '@vue/composition-api'
import store from '@/store'

export interface ToolbarBtnProps {
  [prop: string]: any
}

export default v.defineComponent({
  props: {
    shadowed: {
      type:    Boolean,
      default: false,
    },
    wide: {
      type:    Boolean,
      default: false,
    },
  },
  setup (props: ToolbarBtnProps, context: v.SetupContext) {
    const state = v.reactive({
      classes: v.computed(() => Object.keys(props).map((key: any) => props[key] ? `toolbar-btn--${key}` : null)),
    })
    console.log(props)
    return {
      state,
    }
  },
})
</script>


<style lang="scss" scoped>
.toolbar-btn {
  background: transparent;
  border-top-width: 0;
  border-left-width: 1px;
  border-right-width: 0;
  border-style: solid;
  border-color: $toolbar-border-color;
  height: $toolbar-height;
  width: $toolbar-height;
  color: lighten(black, 40%);
  text-align: center;
  position: relative;
  &:last-child {
    border-right-width: 1px;
  }
  &:first-child {
    border-left-width: 0;
  }
  &:disabled {
    color: lighten(black, 70%);
  }
  &:active {
      background: rgba(0,0,0,0.05);
      box-shadow: inset 0px 5px 10px -10px black;
  }
  > * {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  &--wide {
    width: $toolbar-height * 1.5;
  }
  &--shadowed {
    > * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-80%, -50%);
      opacity: 0.5;
      &:last-child {
        opacity: 1;
        transform: translate(-20%, -50%);
      }
    }
  }
}

</style>
