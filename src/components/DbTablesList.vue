<template>
  <div>
    <h3>Tables</h3>
    <ul tabindex="1">
      <li
        :tabindex="index"
        v-for="(tableName, index) in tableNames"
        :key="index"
        :class="selectedTableClasses(tableName)"
        @mousedown="selectTable({ tab: selectedTab, tableName })"
      >
        {{ tableName }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  computed: {
    ...mapGetters("tabs", ["selectedTab", "selectedTable"]),
    tableNames() {
      return this.selectedTab.tableNames
    }
  },
  methods: {
    ...mapActions("tabs", ["loadTables", "selectTable"]),
    selectedTableClasses(tableName) {
      return [this.isSelectedTable(tableName) ? "selected" : ""]
    },
    isSelectedTable(tableName) {
      return tableName === this.selectedTable.name
    }
  },
  mounted() {
    this.loadTables(this.selectedTab)
  }
}
</script>

<style scoped>
div {
  min-width: 220px;
  display: flex;
  flex-direction: column;
}
h3 {
  text-align: left;
  margin: 0;
  padding: 0 0.75rem 0.75rem;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  background: #efefef;
  flex-grow: 1;
  outline: none;
  user-select: none;
}
li {
  text-align: left;
  cursor: default;
  padding: 0.15rem 0.8rem;
  font-size: 0.9rem;
  outline: none;
}
ul:not(:focus) li.selected:not(:focus) {
  background: #a0a0a0;
  color: white;
}
ul:focus li.selected,
ul li.selected:focus,
ul li:active {
  background: #dc56a7;
  color: white;
}
</style>
