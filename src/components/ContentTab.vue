<template>
  <div class="router-view--flex">
    <db-tables-list />
    <ui-table
      :rows="state.selectedTable.results"
      :fields="state.selectedTable.fields"
      class="grow"
    />
    <!-- <db-tables-toolbar
      :page="state.selectedTable.page"
      :next-page="state.selectedTable.nextPage"
      :prev-page="state.selectedTable.prevPage"
    /> -->
  </div>
</template>

<script>
import DbTablesList from './DbTablesList'
import UiTable from './UiTable'
import { mapGetters } from 'vuex'
import * as v from '@vue/composition-api'
import store from '@/store'

export default v.createComponent({
  components: {
    // DbTablesToolbar,
    DbTablesList,
    UiTable
  },
  setup () {
    const state = v.reactive({
      selectedTable: store.getters.tabs.selectedTable
    })

    return {
      state
    }
  },
})
</script>

<style>
.grow {
  flex-grow: 1;
}
</style>
