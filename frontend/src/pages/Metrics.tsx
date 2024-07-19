import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MetricsSuspense from '@/components/metrics-ui/MetricsSuspense';
import CategoryDistributionChart from '@/components/metrics-ui/hardware/CategoryDistributionChart';
import StatusDistributionTable from '@/components/metrics-ui/hardware/StatusDistributionTable';
import StatusDistributionChart from '@/components/metrics-ui/hardware/StatusDistributionChart';
import AssetTypeDistribution, {
  DataType,
} from '@/components/metrics-ui/hardware/AssetTypeDistribution';
import StatusDefinition from '@/components/metrics-ui/StatusDefinition';
import { HardwareType } from '@/types/asset';
import { fetchAllAssets, fetchOptionValues } from '@/ims-service';

const Metrics = () => {
  const { data: statuses } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => fetchOptionValues('status'),
  });
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchOptionValues('category'),
  });
  const { data: equipmentTypes } = useQuery({
    queryKey: ['equipmentTypes'],
    queryFn: () => fetchOptionValues('equipmentType'),
  });
  const { data: hardwareData, isLoading } = useQuery({
    queryKey: ['hardwareData'],
    queryFn: () => fetchAllAssets('Hardware'),
  });

  const [serviceYearsData, setServiceYearsData] = useState<DataType>({});
  const [equipmentBundleData, setEquipmentBundleData] = useState<DataType>({});
  const [itStorageData, setItStorageData] = useState<DataType>({});
  const [forRepairData, setForRepairData] = useState<DataType>({});

  useEffect(() => {
    const properties = equipmentTypes?.reduce(
      (accum: Record<string, number>, value: string) => {
        accum[value] = 0;
        return accum;
      },
      {}
    );

    const serviceYearsData: DataType = {};
    const bundleData: DataType = {};
    const itStorageData: DataType = {
      MacBook: { ...properties, total: 0 },
      Windows: { ...properties, total: 0 },
    };
    const forRepairData: DataType = {
      MacBook: { ...properties, total: 0 },
      Windows: { ...properties, total: 0 },
    };

    hardwareData?.forEach((asset: HardwareType) => {
      const status = asset?.status;
      const equipmentType = asset?.equipmentType;
      const brand = asset?.brand;
      const category = asset?.category;

      if (status !== undefined && equipmentType !== undefined) {
        // Equipment Bundles
        if (status.endsWith('Bundle')) {
          if (!bundleData[status]) {
            bundleData[status] = { ...properties, total: 0 };
          }
          bundleData[status][equipmentType]++;
          bundleData[status].total++;
        }

        // Deployed Laptop Service Years
        if (
          status === 'Deployed' &&
          category === 'Laptop' &&
          asset.purchaseDate
        ) {
          const purchaseDate = new Date(asset.purchaseDate);
          const currentDate = new Date();
          const serviceYear = Math.floor(
            (currentDate.getTime() - purchaseDate.getTime()) /
              (1000 * 60 * 60 * 24 * 365.25)
          );
          if (!serviceYearsData[serviceYear]) {
            serviceYearsData[serviceYear] = { ...properties, total: 0 };
          }
          serviceYearsData[serviceYear][equipmentType]++;
          serviceYearsData[serviceYear].total++;
        }

        // IT Storage Data
        if (
          status === 'IT Storage' &&
          ['Desktop', 'Laptop', 'Mac Mini'].includes(category)
        ) {
          if (brand === 'Apple') {
            itStorageData['MacBook'][equipmentType]++;
            itStorageData['MacBook'].total++;
          } else {
            itStorageData['Windows'][equipmentType]++;
            itStorageData['Windows'].total++;
          }
        }

        // For Repair Data
        if (
          status === 'For Repair' &&
          ['Desktop', 'Laptop', 'Mac Mini'].includes(category)
        ) {
          if (brand === 'Apple') {
            forRepairData['MacBook'][equipmentType]++;
            forRepairData['MacBook'].total++;
          } else {
            forRepairData['Windows'][equipmentType]++;
            forRepairData['Windows'].total++;
          }
        }
      }
    });

    setServiceYearsData(serviceYearsData);
    setEquipmentBundleData(bundleData);
    setItStorageData(itStorageData);
    setForRepairData(forRepairData);
  }, [hardwareData, equipmentTypes]);

  return (
    <div id="metrics" className="pl-3 pr-1 pb-3 sm:pl-6 sm:pr-1 sm:pb-6">
      {isLoading ? (
        <MetricsSuspense />
      ) : (
        <div className="flex flex-wrap mb-4">
          <CategoryDistributionChart
            categories={categories}
            data={hardwareData}
            className="lg:w-1/4 min-w-[500px]"
          />
          <StatusDistributionTable
            statusData={statuses}
            categoryData={categories}
            assets={hardwareData}
            className="lg:w-3/4 lg:max-w-[calc(100%-500px)]"
          />
          <StatusDistributionChart
            statuses={statuses}
            data={hardwareData}
            className="md:w-1/2"
          />
          <AssetTypeDistribution
            title="Deployed Laptop Service Years"
            equipmentTypes={equipmentTypes}
            data={serviceYearsData}
            className="md:w-1/2"
          />
          <StatusDefinition
            statusData={statuses}
            className="md:w-5/12 lg:w-3/12"
          />
          <div className="md:w-7/12 lg:w-9/12 flex flex-wrap">
            <AssetTypeDistribution
              title="Equipment Bundle"
              equipmentTypes={equipmentTypes}
              data={equipmentBundleData}
              className="lg:w-1/2"
            />
            <AssetTypeDistribution
              title="IT Storage"
              equipmentTypes={equipmentTypes}
              data={itStorageData}
              className="lg:w-1/2"
            />
            <AssetTypeDistribution
              title="For Repair"
              equipmentTypes={equipmentTypes}
              data={forRepairData}
              className="lg:w-1/2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
