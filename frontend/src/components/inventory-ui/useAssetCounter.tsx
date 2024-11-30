import { AssetCounterType } from "@/types/asset";
import { OptionType } from "@/types/options";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as imsService from "@/ims-service";
import { useMemo } from "react";

const useAssetCounter = (isCategory: boolean, option: OptionType) => {
  const queryClient = useQueryClient();
  const categoryName: string =
    isCategory && typeof option.value === "object"
      ? option.value.value
      : (option.value as string);

  const { data: assetCounters, refetch } = useQuery<AssetCounterType[]>({
    queryKey: ["fetchAssetCounters"],
    queryFn: async () => await imsService.fetchAssetCounters(),
  });

  const getAssetCounterFromCategory = () => {
    return isCategory
      ? assetCounters?.find(({ category }) => category === categoryName)
      : undefined;
  };

  const assetCounter = useMemo(
    () => getAssetCounterFromCategory(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCategory, assetCounters, categoryName]
  );

  const updateAssetCounterInCache = (
    _id: string,
    data: { prefixCode?: string; category: string }
  ) => {
    // Updating cache in an immutable way using setQueryData
    const { prefixCode, category } = data;

    const updateWithNewValues = (assetCounter: AssetCounterType) => ({
      ...assetCounter,
      _id,
      prefixCode: prefixCode ?? assetCounter.prefixCode,
      category,
    });

    queryClient.setQueryData<AssetCounterType[]>(
      ["fetchAssetCounters"],
      (oldData) => {
        if (oldData) {
          return oldData.map((assetCounter: AssetCounterType) =>
            assetCounter._id === _id
              ? updateWithNewValues(assetCounter)
              : assetCounter
          );
        }
      }
    );
  };

  return {
    getAssetCounterFromCategory,
    updateAssetCounterInCache,
    assetCounters,
    assetCounter,
    refetch,
  };
};

export default useAssetCounter;
