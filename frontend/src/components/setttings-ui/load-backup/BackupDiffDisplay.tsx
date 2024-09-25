import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { ValidationResult, MongoResult } from './LoadBackupForm';

interface BackupDiffDisplayProps {
  values: ValidationResult['values']
}

export const BackupDiffDisplay: React.FC<BackupDiffDisplayProps> = ({ values }) => {
  const { current, backup } = values!!;
  
  return (
    <ul className="flex flex-col">
      {Object.keys(values!!).map((key) => {
          return (
            <li>
              {key} collection
              <Separator />
              <ul className="flex">
                <div className="w-full flex flex-col">
                  <span>Current Database</span>
                </div>
                <div className="w-full flex flex-col">
                  <span>Backup File</span>
                </div>
              </ul>
            </li>
          )
        })
      }
    </ul>
  )
}

