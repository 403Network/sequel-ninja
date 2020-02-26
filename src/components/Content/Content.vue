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
        <toolbar-btn class="fa-chevron-left" />
        <toolbar-btn class="fa-chevron-right" />
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

export default v.createComponent({
  components: {
    Toolbar,
    ToolbarBtn,
    TablesList,
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
