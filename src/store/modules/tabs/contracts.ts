import { Database, DatabaseRepo, TableRepo } from "@/services/Database/contracts"

export interface Tab {
  connection: Database
  name: string
  uid: string
  disabled: boolean
  tables: ReadonlyArray<TableRepo>
  selectedTable: TableData
}

export interface RawTableData {
  fields: any[]
  results: any[]
}

export interface TableData extends RawTableData {
  name: string
  page: number
}

export interface TabTableTarget {
  tab: Tab
  table: TableRepo
}

export interface DatabaseConfig {
  name: string
  host: string
  user: string
  password: string
  database: string
}
