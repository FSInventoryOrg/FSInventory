'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePDF, Margin } from 'react-to-pdf';
import { Download } from '@phosphor-icons/react';
import DashboardLayout from '@/components/dashboard-ui/DashboardLayout';
import DashboardSuspense from '@/components/dashboard-ui/DashboardSuspense';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import * as imsService from '@/ims-service';

const Dashboard = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: assetData } = useQuery({
    queryKey: ['fetchAllAssets'],
    queryFn: () => imsService.fetchAllAssets(),
  });
  const { data: hardwareData } = useQuery({
    queryKey: ['fetchAllAssets', 'Hardware'],
    queryFn: () => imsService.fetchAllAssets('Hardware'),
  });
  // const { data: softwareData } = useQuery({ queryKey: ['fetchAllAssets', 'Software'], queryFn: () => imsService.fetchAllAssets('Software') })
  const { toPDF, targetRef } = usePDF({
    filename: 'IMS_Dashboard_Report.pdf',
    method: 'save',
    page: {
      margin: Margin.SMALL,
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
    },
  });

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    await toPDF();
    setIsDownloading(false);
  };

  return (
    <section id="dashboard" className="px-3 pb-3 sm:px-6 sm:pb-6">
      <main className="flex-1 flex flex-col gap-4 w-full mb-16" ref={targetRef}>
        {!(assetData && hardwareData) ? (
          <DashboardSuspense />
        ) : (
          <DashboardLayout assetData={assetData} hardwareData={hardwareData} />
        )}
      </main>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDownloadReport}
              className="fixed bottom-6 right-6 rounded-full shadow-lg z-10"
              size="icon"
              disabled={isDownloading}
            >
              <span className="sr-only">Export Dashboard to PDF</span>
              <Download className="text-xl" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs z-10">Export Dashboard to PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </section>
  );
};

export default Dashboard;