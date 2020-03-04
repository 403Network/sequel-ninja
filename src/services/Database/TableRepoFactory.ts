import MySql, { MySqlTableRepo } from './Drivers/MySql'
import { TableRepo, Database } from './contracts'

export default class TableRepoFactory {
  public static get(database: Database, tableName: string): TableRepo {
    switch(typeof database) {
      case typeof MySql:
        return new MySql.TableRepo(database, tableName)
      default:
        throw 'Could not create Table Repository'
    }
  }
} 