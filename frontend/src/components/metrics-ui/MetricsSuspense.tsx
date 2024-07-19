import { Skeleton } from '../ui/skeleton';

const MetricsSuspense = () => {
  return (
    <>
      <div className="flex flex-wrap mb-4">
        <div className="w-full pr-4 pb-4 lg:w-1/4 min-w-[500px] h-[524px]">
          <Skeleton className="h-full" />
        </div>
        <div className="w-full pr-4 pb-4 lg:w-3/4 lg:max-w-[calc(100%-500px)] h-[524px]">
          <Skeleton className="h-full" />
        </div>
        <div className="w-full pr-4 pb-4 md:w-1/2 h-[430px]">
          <Skeleton className="h-full" />
        </div>
        <div className="w-full pr-4 pb-4 md:w-1/2 h-[430px]">
          <Skeleton className="h-full" />
        </div>
        <div className="w-full pr-4 pb-4 md:w-5/12 lg:w-3/12 h-[528px]">
          <Skeleton className="h-full" />
        </div>
        <div className="md:w-7/12 lg:w-9/12 flex flex-wrap h-[528px]">
          <div className="w-full pr-4 pb-4 lg:w-1/2 h-[256px]">
            <Skeleton className="h-full" />
          </div>
          <div className="w-full pr-4 pb-4 lg:w-1/2 h-[256px]">
            <Skeleton className="h-full" />
          </div>
          <div className="w-full pr-4 pb-4 lg:w-1/2 h-[256px]">
            <Skeleton className="h-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default MetricsSuspense;
