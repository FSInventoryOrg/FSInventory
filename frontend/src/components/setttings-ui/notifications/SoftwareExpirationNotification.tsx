import SoftwareExpirationNotificationForm from "./SoftwareExpirationNotificationForm";

const SoftwareExpirationNotification = () => {
  return (
    <div className="pb-2">
      <h1 className="text-xl font-semibold">Software Asset Expiration</h1>
      <h3 className="text-accent-foreground mb-2">
        Set how many days before a software asset expires to receive a
        notification.
      </h3>
      <SoftwareExpirationNotificationForm/>
    </div>
  );
};

export default SoftwareExpirationNotification;
