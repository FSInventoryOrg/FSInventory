'use client';

import DashboardLayout from "@/components/dashboard-ui/DashboardLayout";
import DashboardSuspense from "@/components/dashboard-ui/DashboardSuspense";
// import DashboardSuspense from "@/components/dashboard-ui/DashboardSuspense";
import * as imsService from '@/ims-service';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { data: assetData } = useQuery({ queryKey: ['fetchAllAssets'], queryFn: () => imsService.fetchAllAssets() })
  const { data: hardwareData } = useQuery({ queryKey: ['fetchAllAssets', 'Hardware'], queryFn: () => imsService.fetchAllAssets('Hardware') })
  // const { data: softwareData } = useQuery({ queryKey: ['fetchAllAssets', 'Software'], queryFn: () => imsService.fetchAllAssets('Software') })

  return (
    <section id="dashboard" className="px-3 pb-3 sm:px-6 sm:pb-6" >
      <main className="flex-1 flex flex-col gap-4 w-full">
        {!(assetData && hardwareData) ? 
          <DashboardSuspense />
          :
          <DashboardLayout assetData={assetData} hardwareData={hardwareData} />
        }
        {/* <DashboardLayout assetData={assetData} hardwareData={hardwareData} /> */}

      </main>
    </section>
  )
}

export default Dashboard;