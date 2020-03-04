import { RawTableData, TableData } from '@/store/modules/tabs/contracts'
import { Data } from 'electron'


export interface DatabaseDriver {
  Database: typeof Database
  DatabaseRepo: DatabaseRepo
  TableRepo: typeof TableRepo
}

export abstract class Database {
  abstract connect(config: DatabaseConfig): Promise<any>
  abstract hasConnection: boolean
  abstract query<T>(sql: string): Promise<T>
  abstract close(): Promise<any>
  abstract repo: DatabaseRepo
  abstract createTableRepo(tableName: string): TableRepo
}



export interface DatabasePromiseless {
  hasConnection(): boolean
  connect(callback: (err: any) => void): Promise<any>
  query(sql: string, callback: (err: any, fields: any[], results: any[]) => void): Promise<any>
  end(err: any): void
}


export interface DatabaseRepository {
  constructor(connection: DatabaseConfig): void
  showTables(): Promise<any>
}


export interface DatabaseConfig {

}


export abstract class DatabaseRepo {

  constructor(protected _connection: Database) {
  }

  public get connection(): Database {
    return this._connection
  }

  public set connection(connection: Database) {
    this._connection = connection
  }

  abstract showTables(): Promise<RawTableData>
}

type TableRepoConstructor = {
  _connection: Data,
  _tableName: string,
}

export type StaticTableRepoThis<T> = { new (_connection: Database, _tableName: string): T }

export abstract class TableRepo {

  protected static instance: TableRepo
  public static readonly pageLength: number = 10

  constructor(protected _connection: Database, protected _tableName: string) {
  }

  public static create<T extends TableRepo>(this: StaticTableRepoThis<T>, _connection: Database, _tableName: string) {
    if (!TableRepo.instance) {
      TableRepo.instance = new this(_connection, _tableName)
    }
    return TableRepo.instance
  }

  get connection(): Database {
    return this._connection
  }

  get name(): string {
    return this._tableName
  }

  abstract update(): Promise<boolean>
  abstract destroy(ids: number[] | number): Promise<boolean>
  abstract byId(id: number): Promise<RawTableData>
  abstract list(page: number): Promise<RawTableData>
  abstract count(): Promise<number>
}