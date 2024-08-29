import AutomatedReportForm from '@/components/setttings-ui/automated-report/AutomatedReportForm';
import { AutoMailType } from '@/types/automail';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/Spinner';
import * as imsService from '@/ims-service';

const AutomatedReport = () => {
  const { data: autoMailSettings, isLoading } = useQuery<AutoMailType>({
    queryKey: ['autoMailSettings'],
    queryFn: () => imsService.fetchAutoMailSettings(),
  });

  if (isLoading) {
    return (
      <div
        className="w-full flex justify-center items-center"
        style={{ height: 'calc(100vh - 89px)' }}
      >
        <Spinner />
      </div>
    );
  }

  const defaultValues: AutoMailType = {
    contact: autoMailSettings?.contact || '',
    recipient: autoMailSettings?.recipient || [],
    frequency: autoMailSettings?.frequency || 'Weekly',
    day: autoMailSettings?.day || 31,
    weekday: autoMailSettings?.weekday ?? 6,
    time: autoMailSettings?.time || '00:00',
    nextRoll: autoMailSettings?.nextRoll
      ? new Date(autoMailSettings.nextRoll)
      : undefined,
    lastRollOut: autoMailSettings?.lastRollOut
      ? new Date(autoMailSettings.lastRollOut)
      : undefined,
  };

  return (
    <div className="flex flex-col md:w-5/6 max-w-4xl">
      <div className="pb-2">
        <h1 className="text-xl font-semibold">Automated Report Settings</h1>
        <h3 className="text-accent-foreground">
          Configure settings for automated email reports.
        </h3>
      </div>
      <AutomatedReportForm defaultValues={defaultValues} />
    </div>
  );
};

export default AutomatedReport;
