<template>
  <div>
    <h3>Tables</h3>
    <ul tabindex="1">
      <li v-for="(table, index) in state.tables" ref="tableNameItems" :key="index" :tabindex="index" :class="selectedTableClasses(table.name)" @mousedown="selectTable(table)">
        {{ table.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import store from '@/store'
import * as v from '@vue/composition-api'
import { TabTableTarget } from '@/store/modules/tabs/contracts';
import { TableRepo } from '@/services/Database/contracts';

export default v.createComponent({
  setup () {
    const state: any = v.reactive({
      selectedTab: v.computed(() => store.getters.tabs.selectedTab),
      selectedTable: v.computed(() => store.getters.tabs.selectedTable),
      tables: v.computed(() => state.selectedTab.tables),
    })
    
    const refs: any = v.reactive({
      tableNameItems: v.ref(null)
    })

    const isSelectedTable = (tableName: string): boolean => {
      return tableName === state.selectedTable.name
    }
    
    const selectedTableClasses = (tableName: string) => {
      return [isSelectedTable(tableName) ? "selected selected--persist" : ""]
    }

    const selectTable = (table: TableRepo) => store.dispatch.tabs.selectTable({ tab: state.selectedTab, table } as TabTableTarget)

    const refocusSelected = () => {
      const tableRow = refs.tableNameItems.tableNameItems.find((item: any) => item.classList.contains('selected'))
      tableRow.focus()
    }

    v.onMounted(() => {
      document.body.addEventListener('mousedown', (e) => {
        e.preventDefault()
        const target = e.path.find(targ => targ.classList && targ.classList.contains('selected'))
        const previousFocus = document.querySelector('.selected.selected--persist')
        if (!target) {
          if (previousFocus && !previousFocus.classList.contains('selected--old')) {
            previousFocus.focus()
          } else {
            const childSelector = e.target.querySelector('.selected.selected--persist')
            if (childSelector) childSelector.focus()
          }
        } else {
          target.classList.remove('selected--old')
          target.focus()
          if (previousFocus) previousFocus.classList.add('selected--old')
        }
      })
    })

    v.onMounted(() => store.dispatch.tabs.loadTables(state.selectedTab))

    return {
      state,
      selectTable,
      selectedTableClasses,
      isSelectedTable,
      refs,
    }
  },
})
</script>

<style scoped>
div {
  min-width: 220px;
  display: flex;
  flex-direction: column;
  position: relative;
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
  overflow: scroll;
  height: 100%;
  position: absolute;
  width: 100%;
  top: 32px;
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
