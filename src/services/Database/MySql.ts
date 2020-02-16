const mysql = require("mysql")
import { Database, DatabasePromiseless } from "@/services/Database/contracts"

export default class MySql implements Database {
  private _connection: DatabasePromiseless | null = null
  private noConnectionException = "No Connection found"

  public get hasConnection(): boolean {
    if (!this._connection) {
      return false
    }
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
        if (err) {
          return reject(err)
        }
        resolve({ results, fields })
      })
    })
  }

  public close() {
    return new Promise((resolve, reject) => {
      if (!this._connection) throw this.noConnectionException
      this._connection.end((err: any) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
