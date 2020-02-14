const mysql = require( 'mysql' )
export default class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config)
  }
  
  query(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err, results, fields) => {
        if (err) {
          return reject(err)
        }
        resolve({ results, fields })
      })
    })
  }

  close() {
    return new Promise( (resolve, reject) => {
      this.connection.end(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}