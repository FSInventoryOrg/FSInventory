import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { ValidationResult, MongoResult } from './LoadBackupForm';
import { CaretCircleDown, CaretCircleUp, Circle, RadioButton } from '@phosphor-icons/react';

interface DocumentProps {
  current?: boolean,
  document: MongoResult,
  keys: string[],
  selection: "current" | "backup" | ""
  setSelection: (value: "current" | "backup") => void;
}

interface CollectionDiffProps {
  current: MongoResult,
  backup?: MongoResult,
  keys: string[]
}

interface CollectionDiffDisplayProps {
  collection: {
    current: Array<MongoResult>,
    backup: Array<MongoResult>
  },
  className?: string
}

interface BackupDiffDisplayProps {
  values: ValidationResult['values']
}

const DocumentDiff: React.FC<DocumentProps> = ({ current = false, document, keys, selection = "", setSelection }) => {
  const whichDocument: "current" | "backup" = current ? "current" : "backup";

  return (
    <div className="flex flex-col gap-y-0">
      <div
        className={`p-2
        border-0 rounded-t 
        font-semibold flex 
        gap-x-2 items-center 
        cursor-pointer
        ${current ? "bg-[#cd7169]" : "bg-[#549a59]"}
        `}
        onClick={() => {setSelection(whichDocument)}}
      >
        <div className={`
          h-5 w-5 border-2 rounded-full
          bg-white flex
          justify-center items-center
          ${selection === whichDocument ? "border-[#5e5454]" : "border-[#bbbbbb]"}
          `}
        >
          {selection === whichDocument && <div className="h-[10px] w-[10px] border-0 rounded-full border-[#5e5454] bg-[#5e5454]"/>}
        </div>
        {current ? "Currently in DB" : "Change from Backup File"}
      </div>
      <div className="flex flex-col gap-x-2 p-2 bg-[#141d1f] border-0 rounded-b font-mono">
        <>
          {keys.map((key: string) => {
            return (<span>{`${key}: ${document[key]}`}</span>)
          })}  
        </>
      </div>
    </div>
  )
}

const CollectionDiff: React.FC<CollectionDiffProps> = ({ current, backup, keys }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [selection, setSelection] = useState<"" | "current" | "backup">('')

  const keysToExclude: string[] = ['created', 'createdBy', 'updated', 'updatedBy', '_id', '__v']
  const cleanedKeys: string[] = keys.filter((key: string) => !keysToExclude.includes(key));

  const formatDate = (dateFromDB: string): string => {
    const date: string = new Date(dateFromDB).toDateString();
    const dateAsArray: string[] = date.split(' ');

    return dateAsArray.slice(1).join(' ')
  }

  return (
    <div className={"bg-[#334043] border-0 rounded p-2 flex flex-col gap-y-3 drop-shadow-lg"}>
      <div className="flex gap-x-2">
        <span className="w-fit h-max cursor-pointer">
          {open && <CaretCircleDown size={28} color="#ffffff" weight="fill" onClick={() => setOpen(!open)} />}
          {!open && <CaretCircleUp size={28} color="#ffffff" weight="fill" onClick={() => setOpen(!open)} />}
        </span>
        <div className="w-full flex flex-col gap-y-[2px]">
          <span>{`Document ID: ${current._id}`}</span>
          {backup && <span className="font-light text-sm">{`Updated: ${formatDate(current['updated'] as string)} by ${current['updatedBy']}`}</span>}
          {!backup && <span className="font-light text-sm">{`Created: ${formatDate(current['created'] as string)} by ${current['createdBy']}`}</span>}
        </div>
        <span className={`
          w-fit h-fit px-2 py-1
          border-0 rounded-lg
          flex justify-center
          font-sans font-bold text-xs
          text-nowrap
          ${backup ? "bg-[#2380C2]" : "bg-destructive"}
          `}>
          <>{backup ? "CHANGED" : "NO BACKUP"}</>
        </span>
      </div>
      {open &&
        <>
        {(backup && keys) &&
          <>
            <DocumentDiff current document={current} keys={cleanedKeys} selection={selection} setSelection={setSelection} />
            <DocumentDiff document={backup} keys={cleanedKeys} selection={selection} setSelection={setSelection} />
          </>}
        {(!backup && keys) &&
          <>
            <div className="flex flex-col gap-y-0">
              <div className="p-2 bg-[#6d6c6c] border-0 rounded-t font-semibold">In Database (Not Found In Backup)</div>
              <div className="flex flex-col gap-x-2 p-2 bg-[#141d1f] border-0 rounded-b font-mono">
                <>
                  {keys.map((key: string) => {
                    return (<span>{`${key}: ${current[key]}`}</span>)
                  })}  
                </>
              </div>
            </div>
          </>
        }
        </>
      }
    </div>
  )
}

const CollectionDiffDisplay: React.FC<CollectionDiffDisplayProps> = ({ collection, className }) => {
  const { current, backup } = collection;
  return (
    <div className={`flex flex-col gap-y-6  ${className}`}>
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
            <>
              {isNew ?
                <CollectionDiff current={docInCurrent} keys={keys} /> :
                <CollectionDiff current={docInCurrent} backup={backup[backupIndex]} keys={diffKeys} />
              }
            </>
          )
        })
      }
    </div>
  )
}

export const BackupDiffDisplay: React.FC<BackupDiffDisplayProps> = ({ values }) => {
  const givenValues: ValidationResult['values'] = values!!
  const affectedCollections: string[] = Object.keys(givenValues);

  const [currentTab, setCurrentTab] = useState<string>(affectedCollections[0]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-x-2">
        {affectedCollections.map((key: string) => {
          return (
            <div
              className={`
                flex justify-center px-4 py-1
                hover:text-primary
                ${currentTab === key ?
                'text-primary font-bold' :
                ''
                } cursor-pointer
                transition-colors duration-300 ease-in-out`}
                onClick={() => setCurrentTab(key)}
            >
              <span>{key}</span>
            </div>
          )
        })}
      </div>
      <div className="w-full h-96 border-0 bg-[#141d1f] py-2 overflow-auto">
        {
          affectedCollections.map((collection: string) => {
            return (
              <CollectionDiffDisplay collection={givenValues[collection]} className={`${currentTab === collection ? 'visible' : 'hidden'}`} />
            )
          })
        }
      </div>
    </div>
  )
}

