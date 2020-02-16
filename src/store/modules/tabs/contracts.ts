import { Database } from "@/services/Database/contracts"

export interface Tab {
  connection: Database
  name: string
  uid: string
  disabled: boolean
  tableNames: string[]
  selectedTable: TableData
}

export interface TableData {
  name: string
  page: 0
  fields: any[]
  rows: any[]
}

export interface TabTableTarget {
  tab: Tab
  tableName: TableData
}

export interface DatabaseConfig {
  name: string
  host: string
  user: string
  password: string
  database: string
}
