import { RawTableData, TableData } from '@/store/modules/tabs/contracts'


export interface DatabaseDriver {
  Database: new () => Database
  DatabaseRepo: new (connection: Database) => DatabaseRepo
  TableRepo: new (connection: Database, tableName: string) => TableRepo
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


export abstract class TableRepo {

  protected static readonly pageLength: number = 100

  constructor(protected _connection: Database, protected _tableName: string) {
  }

  get connection(): Database {
    return this._connection
  }

  get name(): string {
    return this._tableName
  }

  abstract update(): Promise<boolean>
  abstract destroy(): Promise<boolean>
  abstract show(id: string | number): Promise<RawTableData>
  abstract list(page: number): Promise<RawTableData>
  abstract count(): Promise<number>
}