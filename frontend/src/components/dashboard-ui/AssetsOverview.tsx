import { StatusCount } from './DashboardLayout'
import CountUp from 'react-countup';
import { Archive, EggCrack, Dresser, RocketLaunch } from "@phosphor-icons/react";
import { hexToRgbA } from '@/lib/utils';

interface AssetsOverviewProps {
  statusCount: StatusCount[];
}

const AssetsOverview = ({ statusCount }: AssetsOverviewProps) => {
  const totalAssets = statusCount.reduce((total, status) => total + status.value, 0);
  const deployed = statusCount.find(status => status.label === 'Deployed');
  const storage = statusCount.find(status => status.label === 'IT Storage');
  const damaged = statusCount.find(status => status.label === 'Damaged');

  return (
    <div className='grid grid-cols-2 gap-7'>
      <div className='flex gap-2 items-center justify-start'>
        <div 
          className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16 flex justify-center items-center rounded-xl'
          style={{ backgroundColor: hexToRgbA('#8d8d8d', 0.3) }}
        >
          <Archive weight='duotone' size={32} style={{ color: '#8d8d8d' }} />
        </div>
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>Total</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={totalAssets} delay={0} duration={1}>
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
          style={{ backgroundColor: `${deployed?.color}30` }}
        >
          <RocketLaunch weight='duotone' size={32} style={{ color: deployed?.color }} />
        </div>
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>Deployed</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={deployed?.value || 0} delay={0} duration={1}>
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
          className='min-h-12 min-w-12 sm:min-h-16 sm:min-w-16 inline-flex justify-center items-center rounded-xl'
          style={{ backgroundColor: `${storage?.color}30` }}
        >
          <Dresser weight='duotone' size={32} style={{ color: storage?.color }} />
        </div>
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>IT Storage</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={storage?.value || 0} delay={0} duration={1}>
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
          style={{ backgroundColor: `${damaged?.color}30` }}
        >
          <EggCrack weight='duotone' size={32} style={{ color: damaged?.color }} />
        </div>
        <div className='flex flex-col'>
          <span className='text-accent-foreground font-semibold text-sm sm:text-md whitespace-nowrap'>Damaged</span>
          <span className='font-bold text-lg sm:text-2xl'>
            <CountUp start={0} end={damaged?.value || 0} delay={0} duration={1}>
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

export default AssetsOverview;