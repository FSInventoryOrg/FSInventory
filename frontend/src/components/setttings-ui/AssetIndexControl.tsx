import * as imsService from "@/ims-service";
import AssetIndexTable from "./AssetIndexTable";
import { useQuery } from "@tanstack/react-query";

const AssetIndexControl = () => {
  const { data } = useQuery({
    queryKey: ["fetchAssetCounters"],
    queryFn: () => imsService.fetchAssetCounters(),
  });

  return <>{data && <AssetIndexTable data={data} />}</>;
};

export default AssetIndexControl;
