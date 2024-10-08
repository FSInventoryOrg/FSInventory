import SoftwareExpirationNotification from './notifications/SoftwareExpirationNotification';
import TrackedStatuses from './notifications/TrackedStatuses';

const NotificationsControl = () => {
  return (
    <div className="w-full">
      <TrackedStatuses />
      <SoftwareExpirationNotification/>
    </div>
  );
};

export default NotificationsControl;
