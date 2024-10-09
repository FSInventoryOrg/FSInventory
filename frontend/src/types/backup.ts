export type MongoResult = {
  _id: string,
  [index: string]: string | number | Array<any>
}

export type ChangeToAdopt = 'current' | 'backup'

export type ValidationResult = {
  message: string,
  outdated?: boolean,
  values?: {
    [index: string]: {
      current: Array<MongoResult>,
      backup: Array<MongoResult>
    }
  }
}
export type CollectionChanges = { [index: string]: { [index: string]: '' | ChangeToAdopt } }
