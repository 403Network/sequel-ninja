<template>
  <button v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
    background: transparent;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 0;
    border-style: solid;
    border-color: #cccccc;
    height: 100%;
    &:last-child {
      border-right-width: 1px;
    }
}

button:active {
    background: rgba(0,0,0,0.05);
    box-shadow: inset 0px 5px 10px -10px black;
}
</style>
