export interface Database {
  connect(DatabaseConfig: object): Promise<any>
  hasConnection: boolean
  query(sql: string): Promise<any>
  close(): Promise<any>
}

export interface DatabasePromiseless {
  hasConnection(): boolean
  connect(callback: (err: any) => void): Promise<any>
  query(
    sql: string,
    callback: (err: any, fields: any[], results: any[]) => void
  ): Promise<any>
  end(err: any): void
}
