
import { useQuery } from "@tanstack/react-query";
import DeployAsset from "@/components/inventory-ui/DeployAsset";
import RetrieveAsset from "@/components/inventory-ui/RetrieveAsset";
import { HardwareType, SoftwareType } from "@/types/asset";
import { Defaults } from '@/types/options';
import * as imsService from '@/ims-service'

interface DeployRetrieveAssetProps {
  assetData: HardwareType | SoftwareType;
  onRetrieve?: () => void;
}

const DeployRetrieveAsset = ({ assetData, onRetrieve }: DeployRetrieveAssetProps) => {
  const { data: defaultOptions, isFetched } = useQuery<Defaults>({ 
    queryKey: ['fetchOptionValues', 'defaults'], 
    queryFn: () => imsService.fetchOptionValues('defaults'),
  })

  if(isFetched) {
    if((defaultOptions?.deployableStatus||[]).includes(assetData.status)) {
      return <DeployAsset assetData={assetData} />
    } else if(assetData.status === defaultOptions?.retrievableStatus) {
      return <RetrieveAsset assetData={assetData} onRetrieve={onRetrieve}/>
    }
  }

  return <></>
}

export default DeployRetrieveAsset