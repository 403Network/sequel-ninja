<template>
  <div class="router-view--flex">
    <db-tables-list></db-tables-list>
    <ui-table :rows="selectedTable.rows" :fields="selectedTable.fields" class="grow" :selected-row="selectedRow"></ui-table>
  </div>
</template>

<script>
import DbTablesList from './DbTablesList'
import UiTable from './UiTable'
import { mapGetters } from 'vuex'
export default {
  components: {
    DbTablesList,
    UiTable,
  },
  computed: {
    ...mapGetters('tabs', ['selectedTable']),
    selectedRow () {
      return 0
    },
  },
}
</script>

<style>
.grow {
  flex-grow: 1;
}
</style>
