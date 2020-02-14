import Database from '../../services/Database'
import UidGenerator from '../../services/UidGenerator'
import QUERIES from '../../services/Queries'
import Vue from 'vue'
import Router from '../../router'

const tab = {
  connection: null,
  name: 'Sequel Ninja',
  uid: null,
  disabled: false,
  tableNames: [],
  selectedTable: {
    name: null,
    page: 0,
    fields: [],
    rows: [],
  }
}

const state = {
  tabs: [{
    ...tab,
    uid: UidGenerator()
  }],
  selectedTabUid: null,
}

const getters = {
  selectedTab: (state) => state.tabs.find(tab => tab.uid === state.selectedTabUid),
  selectedTable: (state, getters) => getters.selectedTab.selectedTable,
  selectedTableName: (state, getters) => getters.selectedTab.tableNames.find(tableName => tableName === getters.selectedTab.selectedTable.name),
}

const actions = {
  async selectTable ({ commit, dispatch }, { tab, tableName }) {
    commit('SET_SELECTED_TABLE', { uid: tab.uid, tableName })
    dispatch('getTableRows', { tab, tableName })

    return tableName
  },
  async getTableRows ({ commit }, { tab, tableName }) {
    // commit('SET_SELECTED_TABLE_DATA', {})
    const min = 0;
    const max = 25;
    const data = await tab.connection.query(`SELECT * FROM ${tableName} LIMIT ${min},${max}`)
    commit('SET_SELECTED_TABLE_DATA', { uid: tab.uid, data })
  },
  async loadTables ({ commit }, tab) {
    const { results, fields } = await tab.connection.query(QUERIES.SHOW_TABLES)

    const data = results.map((item) => {
      return item[fields[0].name]
    })

    commit('SET_TABLE_NAMES', { uid: tab.uid, data })
    return data
  },

  createTab ({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      try {
        let uid
        do {
          uid = UidGenerator()
        } while (state.tabs.find(tab => uid === tab.uid))
        commit('ADD_TAB', { ...JSON.parse(JSON.stringify(tab)), uid })
        dispatch('changeTab', uid)
        resolve(uid)
      } catch (e) {
        reject(e)
      }
    })
  },
  closeSelectedTab ({ dispatch, state }) {
    
    return new Promise((resolve) => {
      dispatch('closeTab', state.selectedTabUid)
      resolve()
    })
  },
  closeTab ({ commit, dispatch, state }, uid) {
    return new Promise((resolve, reject) => {
      try {
        if (state.selectedTabUid === uid) {
          const currentTabIndex = state.tabs.findIndex(tab => tab.uid === uid)
          const newTab = state.tabs[currentTabIndex - 1] || state.tabs[currentTabIndex + 1]
          dispatch('changeTab', newTab.uid)
        }
        commit('DISABLE_TAB', uid)
        Vue.nextTick(() => {
          commit('REMOVE_TAB', uid)
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  createConnection ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const db = new Database(payload)

      db.connection.connect((error) => {
        if (error) {
          reject(error)
        }
        const result = {
          connection: db,
          uid: payload.uid
        }
        commit('CHANGE_TAB_NAME', payload)
        commit('ADD_CONNECTION', result)
        resolve(result)
      })
    })
  },
  changeTab ({ commit }, uid) {
    return new Promise((resolve, reject) => {
      try {
        if (this.selectedTabUid !== uid) {
          Router.replace({ name: 'tab-home', params: { uid: uid }})
          commit('SET_TAB', uid)
        }
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

const mutations = {
  CHANGE_TAB_NAME (state, { uid, name }) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    tab.name = name
  },
  SET_SELECTED_TABLE (state, { uid, tableName }) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    tab.selectedTable.name = tableName
    tab.selectedTable.page = 0
  },
  SET_SELECTED_TABLE_DATA (state, { uid, data }) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    tab.selectedTable.rows = [...data.results]
    tab.selectedTable.fields = [...data.fields]
  },
  SET_TABLE_NAMES (state, { uid, data }) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    tab.tableNames = data
  },
  ADD_TAB (state, payload) {
    state.tabs.push(payload)
  },
  REMOVE_TAB (state, uid) {
    const tabIndex = state.tabs.findIndex(tab => tab.uid === uid)
    if (tabIndex > -1) {
      state.tabs.splice(tabIndex, 1)
    }
    window.st = state.tabs
  },
  SET_TAB (state, uid) {
    state.selectedTabUid = uid
  },
  DISABLE_TAB (state, uid) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    tab.disabled = true
  },
  ADD_CONNECTION (state, { uid, connection }) {
    const tab = state.tabs.find(tab => tab.uid === uid)
    tab.connection = connection
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}