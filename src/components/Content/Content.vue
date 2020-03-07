<template>
  <div class="router-view--flex">
    <tables-list tabindex="1" />
    <ui-table :rows="state.selectedTable.results" :fields="state.selectedTable.fields" class="grow" tabindex="2" @selected="rowsSelected">
      <toolbar :page="state.selectedTable.page" :next-page="state.selectedTable.nextPage" :prev-page="state.selectedTable.prevPage">
        <template slot="left">
          <toolbar-btn :disabled="true" shadowed wide>
            <font-awesome-icon icon="plus" size="sm" />
            <font-awesome-icon icon="plus" size="sm" />
          </toolbar-btn>
          <toolbar-btn :disabled="!state.hasDeletable" wide @click.stop.prevent>
            <font-awesome-icon icon="minus" size="sm" />
          </toolbar-btn>
          <toolbar-btn :disabled="true" wide>
            <font-awesome-icon icon="sync" size="sm" />
          </toolbar-btn>
        </template>

        <template slot="right">
          <toolbar-btn :disabled="!state.hasPrev" @click="prevPage">
            <font-awesome-icon icon="caret-left" />
          </toolbar-btn>
          <toolbar-btn :disabled="!state.hasNext" @click="nextPage">
            <font-awesome-icon icon="caret-right" />
          </toolbar-btn>
        </template>
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
      selectedRows:  0,
      hasDeletable:  v.computed(() => state.selectedRows.length > 0),
    })


    const refreshPage = () => store.dispatch.tabs.deleteRow({ table: state.table, tab: state.selectedTab, page: state.selectedTable.page })
    const nextPage = () => store.dispatch.tabs.getTableRows({ table: state.table, tab: state.selectedTab, page: state.selectedTable.page + 1 })
    const prevPage = () => store.dispatch.tabs.getTableRows({ table: state.table, tab: state.selectedTab, page: state.selectedTable.page - 1 })
    const deleteRow = () => store.dispatch.tabs.deleteRow({ table: state.table, tab: state.selectedTab })
    const rowsSelected = (rows) => state.selectedRows = rows

    return {
      state,
      prevPage,
      nextPage,
      rowsSelected,
    }
  },
})
</script>

<style>
.grow {
  flex-grow: 1;
}
</style>
