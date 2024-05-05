'use client'

import { TableSuspense } from './TableSuspense';
import { Skeleton } from '../ui/skeleton';

const DeploymentInfoSuspense = () => {
  return (
    <>
      <div className='h-full'>
        <div className='h-1/3 flex flex-col gap-4 pb-4'>
          <Skeleton id='banner' className='bg-secondary rounded-lg h-48' />
          <div id='statistics' className='relative'>
            <div className='flex flex-row gap-2 cursor-pointer w-fit h-[70px]'>
              <Skeleton className='flex flex-col bg-secondary rounded-lg px-4 py-2 w-[125px]' />
            </div>
          </div>
        </div>
        <div id='assets table' className='h-2/3'>
          <TableSuspense />
        </div>
      </div>
    </>
  )
}

export default DeploymentInfoSuspense;