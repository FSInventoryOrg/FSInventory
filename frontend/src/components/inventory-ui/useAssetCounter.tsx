import { AssetCounterType } from "@/types/asset";
import { OptionType } from "@/types/options";
import { useQuery } from '@tanstack/react-query';
import * as imsService from "@/ims-service";

const useAssetCounter = (isCategory: boolean, option: OptionType) => {
  const categoryName: string = isCategory && typeof option.value === 'object' ? option.value.value : option.value as string;

  const getAssetCounters = () =>  {return useQuery<
    AssetCounterType[]
  >({
    queryKey: ['fetchAssetCounters'],
    queryFn: async () => await imsService.fetchAssetCounters(),
  })};

  const { data: assetCounters } = getAssetCounters();

  const getAssetCounterFromCategory = () => {
    return isCategory && assetCounters ? assetCounters.find((assetCounter: AssetCounterType) => assetCounter.category === categoryName) : undefined;
  };

  const updateAssetCounterInCache = (_id: string, data: { prefixCode?: string, category: string }) => {
    const { prefixCode, category } = data;
    let assetCounterIndex: number;
    if (assetCounters) {
      assetCounterIndex = assetCounters.findIndex((assetCounter: AssetCounterType) => assetCounter._id === _id)
      let assetCounter: AssetCounterType = assetCounters[assetCounterIndex]
      assetCounters[assetCounterIndex] = { ...assetCounter, _id, prefixCode: prefixCode ?? assetCounter.prefixCode, category }
    }
  }

  return {
    getAssetCounterFromCategory,
    updateAssetCounterInCache,
    getAssetCounters
  }
};

export default useAssetCounter;