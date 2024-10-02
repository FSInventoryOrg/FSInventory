import * as imsService from '@/ims-service';
import AssetIndexTable from './AssetIndexTable';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AssetCounterType } from '@/types/asset';

type AssetType = 'Hardware' | 'Software';

const AssetIndexControl = () => {
  const { data: assetCounters } = useQuery({
    queryKey: ['fetchAssetCounters'],
    queryFn: () => imsService.fetchAssetCounters(),
  });

  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState<AssetType>('Hardware');

  useEffect(() => {
    setData(
      (assetCounters || []).filter(
        (assetIdx: AssetCounterType) => assetIdx.type === selectedType
      )
    );
  }, [assetCounters, selectedType]);

  const handleTypeChange = (type: AssetType) => {
    setSelectedType(type);
  };

  return (
    <>
      {data && (
        <AssetIndexTable
          data={data}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
        />
      )}
    </>
  );
};

export default AssetIndexControl;
