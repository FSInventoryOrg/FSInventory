
import CountUp from 'react-countup';
import { AppleLogo, WindowsLogo } from "@phosphor-icons/react";
import { hexToRgbA } from '@/lib/utils';

interface BundlesOverviewProps {
  windows: number;
  macbooks: number;
}

const BundlesOverview = ({ windows, macbooks }: BundlesOverviewProps) => {
  
  return (
    <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-1 grid-rows-1 sm:grid-rows-2 gap-7'>
      <div className='flex gap-2 items-center justify-start'>
        <div 
          className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16 flex justify-center items-center rounded-xl'
          style={{ backgroundColor: hexToRgbA('#6A8CFF', 0.3) }}
        >
          <WindowsLogo weight='duotone' size={32} style={{ color: '#6A8CFF' }} />
        </div>
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>Windows</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={windows} delay={0} duration={1}>
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
        <div 
          className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16 flex justify-center items-center rounded-xl'
          style={{ backgroundColor: hexToRgbA('#8d8d8d', 0.3) }}
        >
          <AppleLogo weight='duotone' size={32} style={{ color: '#8d8d8d' }} />
        </div>
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>MacBook</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={macbooks} delay={0} duration={1}>
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

export default BundlesOverview;