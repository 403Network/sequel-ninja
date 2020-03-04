<template>
  <div class="router-view--flex">
    <tables-list />
    <ui-table
      :rows="state.selectedTable.results"
      :fields="state.selectedTable.fields"
      class="grow"
    >
      <toolbar
        :page="state.selectedTable.page"
        :next-page="state.selectedTable.nextPage"
        :prev-page="state.selectedTable.prevPage"
      >
        <toolbar-btn class="fa-chevron-left" :disabled="!state.hasPrev" @click="prevPage" />
        <toolbar-btn class="fa-chevron-right" :disabled="!state.hasNext" @click="nextPage" />
      </toolbar>
    </ui-table>
  </div>
</template>

<script>
import TablesList from '@/components/Content/TablesList'
import Toolbar from '@/components/Content/Toolbar/Toolbar'
import ToolbarBtn from '@/components/Content/Toolbar/ToolbarBtn'
import UiTable from '@/components/Generic/UiTable'
import { mapGetters } from 'vuex'
import * as v from '@vue/composition-api'
import store from '@/store'

export default v.defineComponent({
  components: {
    Toolbar,
    ToolbarBtn,
    TablesList,
    UiTable,
  },
  setup () {
    const state = v.reactive({
      selectedTable: v.computed(() => store.getters.tabs.selectedTable),
      selectedTab:   v.computed(() => store.getters.tabs.selectedTab),
      table:         v.computed(() => state.selectedTab.tables.find(table => table.name === state.selectedTable.name)),
      hasPrev:       v.computed(() => state.selectedTable.page > 1),
      hasNext:       v.computed(() => state.selectedTable.page < state.selectedTable.totalPages),
    })

    
    const nextPage = () => store.dispatch.tabs.getTableRows({ table: state.table, tab: state.selectedTab, page: state.selectedTable.page + 1 })
    const prevPage = () => store.dispatch.tabs.getTableRows({ table: state.table, tab: state.selectedTab, page: state.selectedTable.page - 1 })

    return {
      state,
      prevPage,
      nextPage,
    }
  },
})
</script>

<style>
.grow {
  flex-grow: 1;
}
</style>
