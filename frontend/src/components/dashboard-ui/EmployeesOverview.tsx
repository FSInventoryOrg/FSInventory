
import CountUp from 'react-countup';
import { Skeleton } from '../ui/skeleton';
import { ShieldWarning, UserCircleCheck } from "@phosphor-icons/react";
import { hexToRgbA } from '@/lib/utils';

interface EmployeesOverviewProps {
  activeEmployees: number;
  unregisteredEmployees: number;
}

const EmployeesOverview = ({ activeEmployees, unregisteredEmployees }: EmployeesOverviewProps) => {

  return (
    <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-1 grid-rows-1 sm:grid-rows-2 gap-7'>
      <div className='flex gap-2 items-center justify-start'>
        {activeEmployees ? (
          <div 
            className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16 flex justify-center items-center rounded-xl'
            style={{ backgroundColor: hexToRgbA('#33CC80', 0.3) }}
          >
            <UserCircleCheck weight='duotone' size={32} style={{ color: '#33CC80' }} />
          </div>
        ): (
          <Skeleton className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16' />
        )}
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>Active</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={activeEmployees} delay={0} duration={1}>
              {({ countUpRef }) => (
                <div>
                  <span ref={countUpRef} />
                </div>
              )}
            </CountUp>
          </span>
        </div>
      </div>
      <div className='flex gap-2 items-center justify-start'>
        {unregisteredEmployees ? (
          <div 
            className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16 flex justify-center items-center rounded-xl'
            style={{ backgroundColor: hexToRgbA('#D02F2F', 0.3) }}
          >
            <ShieldWarning weight='duotone' size={32} style={{ color: '#D02F2F' }} />
          </div>
        ): (
          <Skeleton className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16' />
        )}
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>Unregistered</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={unregisteredEmployees} delay={0} duration={1}>
              {({ countUpRef }) => (
                <div>
                  <span ref={countUpRef} />
                </div>
              )}
            </CountUp>
          </span>
        </div>
      </div>
  </div>
  )
}

export default EmployeesOverview;