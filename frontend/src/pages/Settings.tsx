import AssetIndexControl from "@/components/setttings-ui/AssetIndexControl";
import SidebarNav from "@/components/setttings-ui/SidebarNav";
import { Separator } from "@/components/ui/separator";
import { Navigate, Route, Routes } from "react-router-dom";

const Settings = () => {
  const settingsNavItems = [
    {
      title: "Asset Index",
      href: "/settings/assetcontrol",
    },
  ];

  return (
    <section id="settings" className="container w-full max-w-7xl py-6 px-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="h-100 mx-5 lg:w-1/5">
          <SidebarNav items={settingsNavItems} />
        </aside>
        <div className="settings-content container w-full">
          <Routes>
            <Route path="/" element={<Navigate to="assetcontrol" />} />
            <Route path="/assetcontrol" element={<AssetIndexControl />} />
          </Routes>
        </div>
      </div>
    </section>
  );
};

export default Settings;
