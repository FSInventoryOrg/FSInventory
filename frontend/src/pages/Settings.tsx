import { Navigate, Route, Routes } from 'react-router-dom';
import SidebarNav from '@/components/setttings-ui/SidebarNav';
import AssetIndexControl from '@/components/setttings-ui/AssetIndexControl';
import NotificationsControl from '@/components/setttings-ui/NotificationsControl';
import { Separator } from '@/components/ui/separator';
import InventorySettings from '../components/setttings-ui/inventory/InventorySettings';
import AutomatedReportSettings from '@/components/setttings-ui/automated-report/AutomatedReportSettings';
import LoadBackupForm from '@/components/setttings-ui/load-backup/LoadBackupForm';

const Settings = () => {
  const settingsNavItems = [
    {
      title: 'Asset Index',
      href: '/settings/assetcontrol',
    },
    {
      title: 'Notifications',
      href: '/settings/notifications',
    },
    {
      title: 'Inventory',
      href: '/settings/inventory',
    },
    {
      title: 'Automated Report',
      href: '/settings/automated-report',
    },
    {
      title: 'Load System Backup File',
      href: '/settings/load-backup'
    }
  ];

  return (
    <section
      id="settings"
      className="flex flex-col w-full px-6 pb-3 md:px-24 sm:pb-6 pt-3"
    >
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your settings and preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-2 gap-8 lg:flex-row lg:space-y-0">
        <aside className="h-100 mx-5 md:w-1/4">
          <SidebarNav items={settingsNavItems} />
        </aside>
        <div className="settings-content w-full h-full">
          <Routes>
            <Route path="/" element={<Navigate to="assetcontrol" />} />
            <Route path="/assetcontrol" element={<AssetIndexControl />} />
            <Route path="/notifications" element={<NotificationsControl />} />
            <Route path="/inventory" element={<InventorySettings />} />
            <Route
              path="/automated-report"
              element={<AutomatedReportSettings />}
            />
            <Route path="/load-backup" element={<LoadBackupForm />} />
          </Routes>
        </div>
      </div>
    </section>
  );
};

export default Settings;
