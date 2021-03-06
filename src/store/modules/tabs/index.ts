import { MutationExceptions } from '@/store/contracts'
import UidGenerator from '@/services/UidGenerator'
import MySql from '@/services/Database/Drivers/MySql'
import Vue from 'vue'
import { StoreOptions } from 'vuex'
import Router from '@/router'
import { Tab, TableData, TabTableTarget, DatabaseConfig, RawTableData } from './contracts'
import { Database, TableRepo } from '@/services/Database/contracts'
import TableRepoFactory from '@/services/Database/TableRepoFactory'

const mutationExceptions: MutationExceptions = {
  TAB_NOT_FOUND: 'Could not find tab uid.',
}

interface TabState {
  tabs: Tab[]
  selectedTabUid: string | null
}

const createNewTab = (uid: string): Tab => {
  return {
    connection:    new MySql.Database,
    uid,
    name:          'Sequel Ninja',
    disabled:      false,
    tables:        [],
    selectedTable: {
      name:        '',
      page:        1,
      totalPages:  1,
      fields:      [],
      results:     [],
      rowPosition: {
        start: 0,
        end:   0,
      },
    } as TableData,
  }
}

const state: TabState = {
  tabs:           [],
  selectedTabUid: null,
}

const getters = {
  selectedTab:       (state: any) => state.tabs.find((tab: Tab) => tab.uid === state.selectedTabUid),
  selectedTable:     (state: any, getters: any) => getters.selectedTab.selectedTable,
  selectedTableName: (state: any, getters: any) => getters.selectedTab.tableNames.find((tableName: any) => tableName === getters.selectedTab.selectedTable.name),
}

const actions = {
  selectTable({ commit, dispatch }: any, { tab, table }: TabTableTarget) {
    commit('SET_SELECTED_TABLE', { uid: tab.uid, tableName: table.name })
    dispatch('getTableRows', { tab, table, page: 1 })
  },
  async getTableRows({ commit }: any, { tab, table, page }: TabTableTarget & { page: number }) {
    const data = await table.list(page)
    const totalRows = await table.count()
    // 5*3-3+1
    commit('SET_SELECTED_TABLE_DATA', {
      data,
      page,
      totalRows,
      uid:         tab.uid,
      startRow:    page * data.results.length - data.results.length,
      rowPosition: {
        start: page * data.results.length - data.results.length + 1,
        end:   page * data.results.length,
      },
      totalPages: Math.round(totalRows / TableRepo.pageLength),
    })
  },
  async loadTables({ commit }: any, tab: Tab) {
    const data: RawTableData = await tab.connection.repo.showTables()
    const tables = data.results.map(row => TableRepoFactory.get(tab.connection, row[data.fields[0].name]))
    commit('SET_TABLES', { uid: tab.uid, tables })
    return data
  },
  createTab({ commit, dispatch, state }: any) {
    return new Promise((resolve, reject) => {
      let uid: string
      do {
        uid = UidGenerator()
      } while (state.tabs.find((tab: Tab) => uid === tab.uid))
      commit('ADD_TAB', createNewTab(uid))
      dispatch('changeTab', uid)
      resolve(uid)
    })
  },
  closeSelectedTab({ dispatch, state }: any) {
    return new Promise(resolve => {
      dispatch('closeTab', state.selectedTabUid)
      resolve()
    })
  },
  closeTab({ commit, dispatch, state }: any, uid: string) {
    return new Promise((resolve, reject) => {
      if (state.selectedTabUid === uid) {
        const currentTabIndex = state.tabs.findIndex((tab: Tab) => tab.uid === uid)
        const newTab = state.tabs[currentTabIndex - 1] || state.tabs[currentTabIndex + 1]
        dispatch('changeTab', newTab.uid)
      }
      commit('DISABLE_TAB', uid)
      Vue.nextTick(() => commit('REMOVE_TAB', uid))
      resolve()
    })
  },
  createConnection({ commit, state }: any, payload: { config: DatabaseConfig, uid: string }) {
    return new Promise((resolve, reject) => {
      const tab: Tab = state.tabs.find((tab: Tab) => tab.uid === payload.uid)
      tab.connection.connect(payload.config)
      commit('CHANGE_TAB_NAME', {
        name: payload.config.name,
        uid:  payload.uid,
      })
      resolve()
    })
  },
  changeTab({ commit, state }: any, uid: string) {
    return new Promise((resolve, reject) => {
      const tab: Tab = state.tabs.find((tab: Tab) => tab.uid === uid)
      if (tab?.disabled) return
      if (state.selectedTabUid !== uid) {
        Router.replace({ name: 'tab-content', params: { uid: uid }})
        commit('SET_TAB', uid)
      }
      resolve()
    })
  },
}

const mutations = {
  CHANGE_TAB_NAME(state: TabState, { uid, name }: { uid: string, name: string }) {
    const tab = state.tabs.find((tab: Tab) => tab.uid === uid)
    if (!tab) throw mutationExceptions.TAB_NOT_FOUND
    tab.name = name
  },
  SET_SELECTED_TABLE(state: TabState, { uid, tableName }: { uid: string, tableName: string }) {
    const tab = state.tabs.find((tab: Tab) => tab.uid === uid)
    if (!tab) throw mutationExceptions.TAB_NOT_FOUND
    tab.selectedTable.name = tableName
  },
  SET_SELECTED_TABLE_DATA(state: TabState, { uid, data, page, totalPages, rowPosition }: { uid: string, data: any, page: number, totalPages: number, rowPosition: { start: number, end: number } }) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    if (!tab) throw mutationExceptions.TAB_NOT_FOUND
    tab.selectedTable.results = [...data.results]
    tab.selectedTable.fields = [...data.fields]
    tab.selectedTable.page = page
    tab.selectedTable.totalPages = totalPages
    tab.selectedTable.rowPosition = rowPosition
  },
  SET_TABLES(state: TabState, { uid, tables }: { uid: string, tables: TableRepo[] }) {
    const tab = state.tabs.find((tab: Tab) => tab.uid === uid)
    if (!tab) throw mutationExceptions.TAB_NOT_FOUND
    tab.tables = Object.freeze(tables)
  },
  ADD_TAB(state: TabState, tab: Tab) {
    state.tabs.push(tab)
  },
  REMOVE_TAB(state: TabState, uid: string) {
    const tabIndex = state.tabs.findIndex(tab => tab.uid === uid)
    if (tabIndex > -1) {
      state.tabs.splice(tabIndex, 1)
    }
  },
  SET_TAB(state: TabState, uid: string) {
    state.selectedTabUid = uid
  },
  DISABLE_TAB(state: TabState, uid: string) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    if (!tab) throw mutationExceptions.TAB_NOT_FOUND
    tab.disabled = true
  },
  ADD_CONNECTION(state: TabState, { uid, connection }: { uid: string, connection: Database }) {
    const tab: Tab | undefined = state.tabs.find(tab => tab.uid === uid)
    if (!tab) throw mutationExceptions.TAB_NOT_FOUND
    tab.connection = connection
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
} as StoreOptions<TabState>
