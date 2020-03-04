const mysql = require('mysql')
import { DatabaseDriver, Database, DatabasePromiseless, DatabaseRepo, TableRepo, StaticTableRepoThis } from '@/services/Database/contracts'
import { RawTableData } from '@/store/modules/tabs/contracts'

class MySqlDatabase implements Database {
  private _connection: DatabasePromiseless | null = null
  private noConnectionException = 'No Connection found'
  private _repo: MySqlDatabaseRepo

  public constructor() {
    this._repo = new MySqlDatabaseRepo(this)
  }

  public get repo(): MySqlDatabaseRepo {
    return this._repo
  }

  public createTableRepo(tableName: string): MySqlTableRepo {
    return new MySqlTableRepo(this, tableName)
  }

  public set repo(repo: MySqlDatabaseRepo) {
    this._repo = repo
  }

  public get hasConnection(): boolean {
    if (!this._connection) return false
    return true
  }

  public connect(config: object) {
    return new Promise((resolve, reject) => {
      this._connection = mysql.createConnection(config) as DatabasePromiseless
      this._connection.connect((error: any) => {
        if (error) {
          reject(error)
        }
        resolve()
      })
    })
  }

  public query(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._connection) throw this.noConnectionException
      this._connection.query(sql, (err: any, results: any[], fields: any[]) => {
        if (err) return reject(err)
        resolve({ results, fields })
      })
    })
  }

  public close() {
    return new Promise((resolve, reject) => {
      if (!this._connection) throw this.noConnectionException
      this._connection.end((err: any) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}


export class MySqlTableRepo extends TableRepo {

  protected static instance: MySqlTableRepo

  public byId(id: number): Promise<RawTableData> {
    return this.connection.query<RawTableData>(`SELECT * FROM ${this._tableName} WHERE id=${id}`)
  }

  public async count(): Promise<number> {
    const query = await this.connection.query<RawTableData>(`SELECT COUNT(*) FROM ${this._tableName}`)

    return query.results[0][query.fields[0].name]
  }

  public list(page: number = 1): Promise<RawTableData> {
    const min = (page * TableRepo.pageLength) - TableRepo.pageLength
    const max = page * TableRepo.pageLength
    const offset = TableRepo.pageLength * page - TableRepo.pageLength
    return this.connection.query<RawTableData>(`SELECT * FROM ${this._tableName} LIMIT ${TableRepo.pageLength} OFFSET ${offset}`)
  }

  public async update(): Promise<boolean> {
    const result = await this.connection.query<RawTableData>('')
    if (result) {
      return true
    }
    return false
  }

  public async destroy($ids: number[] | number): Promise<boolean> {
    const result = await this.connection.query<RawTableData>('')
    if (result) {
      return true
    }
    return false
  }
  

}


class MySqlDatabaseRepo extends DatabaseRepo {

  public readonly tableRepo: typeof TableRepo = MySqlTableRepo

  public showTables(): Promise<RawTableData> {
    return this.connection.query<RawTableData>('SHOW TABLES')
  }
}

export interface MySqlDatabaseDriver extends DatabaseDriver {
  Database: typeof MySqlDatabase
  DatabaseRepo: DatabaseRepo
  TableRepo: typeof MySqlTableRepo
}

export default {
  Database:     MySqlDatabase,
  DatabaseRepo: MySqlDatabaseRepo,
  TableRepo:    MySqlTableRepo,
} as unknown as MySqlDatabaseDriver