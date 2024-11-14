import CountUp from "react-countup";
import { ScrollArea } from "../ui/scroll-area";

interface AssesCountProps {
  assetCounts: { [category: string]: number };
}

const AssetCounts = ({ assetCounts }: AssesCountProps) => {
  return (
    <div className="flex flex-col border border-solid p-4 h-full max-h-[160px] rounded-[8px]">
      <div className="flex justify-between px-2">
        <span className="text-[16px] font-regular sm:font-bold dark:text-white text-muted-foreground self-end overflow-ellipsis whitespace-nowrap">
          TOTAL ASSETS
        </span>
        <span className="text-[16px] font-bold dark:text-white text-muted-foreground self-end">
          <CountUp
            start={0}
            end={Object.values(assetCounts).reduce(
              (acc, count) => acc + count,
              0
            )}
            delay={0}
            duration={1}
          >
            {({ countUpRef }) => (
              <div>
                <span ref={countUpRef} />
              </div>
            )}
          </CountUp>
        </span>
      </div>

      <ScrollArea
        className="flex flex-col gap-[8px] px-2 mt-1"
        scrollHideDelay={0}
      >
        {Object.entries(assetCounts).map(([category, count]) => (
          <div
            key={category}
            className="w-full flex rounded-lg justify-between py-1"
          >
            <span className="font-semibold text-muted-foreground text-end text-ellipsis overflow-hidden whitespace-nowrap">
              {category}
            </span>
            <span className="text-[16px] font-bold dark:text-accent-foreground text-muted-foreground self-end">
              <CountUp start={0} end={count} delay={0.08} duration={1}>
                {({ countUpRef }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>
            </span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default AssetCounts;
