<template>
  <button v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
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
    &:last-child {
      border-right-width: 1px;
    }
    &:disabled {
      color: lighten(black, 70%);
    }
}

button:active {
    background: rgba(0,0,0,0.05);
    box-shadow: inset 0px 5px 10px -10px black;
}
</style>
