import { useState } from 'react';
import { ValidationResult, MongoResult } from '@/types/backup';
import { CaretCircleDown, CaretCircleUp } from '@phosphor-icons/react';

export type ChangeToAdopt = 'current' | 'backup'

interface DocumentProps {
  current?: boolean,
  document: MongoResult,
  keys: string[],
  selection: ChangeToAdopt | ""
  setSelection: (id: string, value: ChangeToAdopt) => void;
  isLight: 'light' | 'dark' | 'system';
}

interface CollectionDiffProps {
  current: MongoResult,
  backup?: MongoResult,
  keys: string[],
  setChanges: (id: string, change: ChangeToAdopt) => void
  isLight: 'light' | 'dark' | 'system';
}

interface CollectionDiffDisplayProps {
  collection: {
    current: Array<MongoResult>,
    backup: Array<MongoResult>
  },
  className?: string,
  setChanges: (id: string, change: ChangeToAdopt) => void
  isLight: 'light' | 'dark' | 'system';
}

interface BackupDiffDisplayProps {
  values: ValidationResult['values'];
  changes: {
    [index: string]: {
      [index: string]: '' | ChangeToAdopt
    }
  };
  setChanges: (changes: { [index: string]: { [index: string]: '' | ChangeToAdopt } }) => void;
  isLight: 'light' | 'dark' | 'system';
}

const DocumentDiff: React.FC<DocumentProps> = ({ current = false, document, keys, selection = "", setSelection, isLight }) => {
  const whichDocument: ChangeToAdopt = current ? "current" : "backup";

  return (
    <ul className={`doc-info ${selection === whichDocument ? "selected" : "unselected"}`}>
      <div
        className={`source changed ${current ? "current" : "backup"}`}
        onClick={() => {setSelection(document._id, whichDocument)}}
      >
        <div className={`radio ${selection === whichDocument ? "selected" : "unselected"}`}>
          {selection === whichDocument && <div />}
        </div>
        {current ? "Currently in DB" : "Change from Backup File"}
      </div>
      <div className={`fields ${isLight}`}>
        <>
          {keys.map((key: string) => {
            return (<li className="list-none" key={document._id+'.'+key}><span>{`${key}: ${document[key]}`}</span></li>)
          })}  
        </>
      </div>
    </ul>
  )
}

const CollectionDiff: React.FC<CollectionDiffProps> = ({ current, backup, keys, setChanges, isLight }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [selection, setSelection] = useState<"" | ChangeToAdopt>('')

  const keysToExclude: string[] = ['created', 'createdBy', 'updated', 'updatedBy', '_id', '__v']
  const cleanedKeys: string[] = keys.filter((key: string) => !keysToExclude.includes(key));

  const formatDate = (dateFromDB: string): string => {
    const date: string = new Date(dateFromDB).toDateString();
    const dateAsArray: string[] = date.split(' ');

    return dateAsArray.slice(1).join(' ')
  }

  return (
    <div className={`doc ${isLight}`}>
      <div className="flex gap-x-2">
        <span className="w-fit h-max cursor-pointer">
          {open && <CaretCircleDown size={28} color={`${isLight === 'light' ? '#000000' : '#EBEDEF'}`} weight="fill" onClick={() => setOpen(!open)} />}
          {!open && <CaretCircleUp size={28} color={`${isLight === 'light' ? '#000000' : '#EBEDEF'}`} weight="fill" onClick={() => setOpen(!open)} />}
        </span>
        <div className="w-full flex flex-col gap-y-[2px]">
          <span>{`Document ID: ${current._id}`}</span>
          {backup && backup['updated'] && <span className="font-light text-sm">{`Updated: ${formatDate(current['updated'] as string)} by ${current['updatedBy']}`}</span>}
          {!backup && <span className="font-light text-sm">{`Created: ${formatDate(current['created'] as string)} by ${current['createdBy']}`}</span>}
        </div>
        <span className={`diff-tag ${backup ? "bg-[#2380C2]" : "bg-destructive"}`}>
          <>{backup ? "CHANGED" : "NO BACKUP"}</>
        </span>
      </div>
      {open &&
        <>
        {(backup && keys) &&
          <>
          <DocumentDiff
            current
            document={current}
            keys={cleanedKeys}
            selection={selection}
            setSelection={(id: string, value: ChangeToAdopt) => {
              setSelection(value)
              setChanges(id, value)
            }}
            isLight={isLight}
          />
          <DocumentDiff
            document={backup}
            keys={cleanedKeys}
            selection={selection}
            setSelection={(id: string, value: ChangeToAdopt) => {
              setSelection(value)
              setChanges(id, value)
            }}
            isLight={isLight}
          />
          </>}
        {(!backup && keys) &&
          <>
            <div className={`doc-info ${isLight}`}>
              <div className="source new">In Database (Not Found In Backup)</div>
              <div className={`fields ${isLight}`}>
                <ul>
                  {keys.map((key: string) => {
                    return (<li className="list-none" key={current._id+'.'+key}><span>{`${key}: ${current[key]}`}</span></li>)
                  })}  
                </ul>
              </div>
            </div>
          </>
        }
        </>
      }
    </div>
  )
}

const CollectionDiffDisplay: React.FC<CollectionDiffDisplayProps> = ({ collection, className, setChanges, isLight }) => {
  const { current, backup } = collection;
  return (
    <div className={`${className}`}>
      <ul className="flex flex-col gap-y-6">
      {
        current.map((docInCurrent: MongoResult) => {
          const backupIndex: number = backup.findIndex((docInBackup: MongoResult) => docInCurrent._id === docInBackup._id)
          const isNew: boolean = backupIndex === -1
          const keysToExclude: string[] = ['created', 'createdBy', 'updated', 'updatedBy', '_id', '__v']
          const keys: string[] = Object.keys(docInCurrent).filter((key: string) => !keysToExclude.includes(key));
          const diffKeys: string[] = isNew ? [] : keys.filter((key: string) => {
            if (docInCurrent[key] && docInCurrent[key].constructor === Array) {
              const docAsArr: any[] = docInCurrent[key] as any[]
              const backupAsArr: any[] = backup[backupIndex][key] as any[]
              return docAsArr.filter((item: any) => !backupAsArr.includes(item)).length
            } else {
              return docInCurrent[key] !== backup[backupIndex][key]
            }
          });


          return (
            <li className="list-none" key={docInCurrent._id}>
              {isNew ?
                <CollectionDiff
                  current={docInCurrent}
                  keys={keys}
                  setChanges={() => setChanges}
                  isLight={isLight}
                /> :
                <CollectionDiff
                  current={docInCurrent}
                  backup={backup[backupIndex]}
                  keys={diffKeys}
                  setChanges={(id: string, change: ChangeToAdopt) => {
                    setChanges(id, change)
                  }}
                  isLight={isLight}
                />
              }
            </li>
          )
        })
      }
      </ul>
    </div>
  )
}

export const BackupDiffDisplay: React.FC<BackupDiffDisplayProps> = ({ values, changes, setChanges, isLight }) => {
  const givenValues: ValidationResult['values'] = values!
  const affectedCollections: string[] = Object.keys(givenValues);

  const [currentTab, setCurrentTab] = useState<string>(affectedCollections[0]);

  const setChangeToAdopt = (collection: string, id: string, change: ChangeToAdopt) => {
    changes[collection][id] = change;
  }

  return (
    <div className="diffs">
      <div className="flex gap-x-2">
        {affectedCollections.map((key: string) => {
          return (
            <li className="list-none" key={key}>
              <div
                className={`tab ${currentTab === key ? 'text-primary font-bold' : ''}`}
                onClick={() => setCurrentTab(key)}
              >
                <span>{key}</span>
              </div>
            </li>
          )
        })}
      </div>
      <div className={`w-full h-96 border-0 py-2 overflow-auto`}>
        <ul>
          {
            affectedCollections.map((collection: string) => {
              return (
                <li className="list-none" key={collection+'_changes'}>
                  <CollectionDiffDisplay
                    collection={givenValues[collection]}
                    className={`${currentTab === collection ? 'visible' : 'hidden'}`}
                    setChanges={(id, string) => {
                      setChangeToAdopt(collection, id, string)
                      setChanges(changes)
                    }}
                    isLight={isLight}
                  />
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

