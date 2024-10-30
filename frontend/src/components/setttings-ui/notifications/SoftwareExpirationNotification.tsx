import { useQuery } from "@tanstack/react-query";
import SoftwareExpirationNotificationForm from "./SoftwareExpirationNotificationForm";
import * as imsService from '@/ims-service';
import { NotificationSettingType } from "@/types/notification-setting";

const SoftwareExpirationNotification = () => {
  const { data: settingsData } = useQuery<NotificationSettingType>({
    queryKey: ['fetchSoftwareNotificationSettings'],
    queryFn: () => imsService.fetchSoftwareNotif()
  });

  return (
    <div className="pb-2">
      <h1 className="text-xl font-semibold">Software Asset Expiration</h1>
      <h3 className="text-accent-foreground mb-2">
        Set how many days before a software asset expires to receive a
        notification.
      </h3>
      {settingsData && <SoftwareExpirationNotificationForm defaultValues={settingsData}/>}
    </div>
  );
};

export default SoftwareExpirationNotification;
