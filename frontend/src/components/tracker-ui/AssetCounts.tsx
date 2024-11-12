import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface AssesCountProps {
  assetCounts: { [category: string]: number };
}

const AssetCounts = ({ assetCounts }: AssesCountProps) => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <div
      className="flex flex-row gap-2 cursor-pointer w-full sm:w-fit"
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      <div className="flex flex-col bg-secondary rounded-lg border px-4 py-2 w-[125px]">
        <span className="text-xs font-regular sm:font-bold text-accent-foreground self-end overflow-ellipsis whitespace-nowrap">
          TOTAL ASSETS
        </span>
        <span className="text-xl sm:text-3xl font-bold text-accent-foreground self-end">
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
      <div className="hidden sm:block">
        {Object.entries(assetCounts).map(([category, count], index) => (
          <motion.div
            initial={{ x: 0 }} // Ensure lower index has higher zIndex
            animate={{ x: expanded ? 100 * (index + 1) : 15 * (index + 1) }}
            transition={{
              type: "spring",
              ease: "easeInOut",
              duration: 0.2,
              delay: index * 0.05,
            }} // Adjust delay for staggered animation
            key={category}
            className="w-[125px] flex flex-col bg-accent rounded-lg border px-4 py-2 absolute top-0 left-0"
            style={{ zIndex: -(index + 1) }} // Ensure zIndex transitions properly
          >
            <span className="text-xs font-regular sm:font-bold text-muted-foreground text-end text-ellipsis overflow-hidden whitespace-nowrap w-full">
              {category.toUpperCase()}
            </span>
            <span className="text-xl sm:text-3xl font-bold text-accent-foreground self-end">
              <CountUp start={0} end={count} delay={0.08} duration={1}>
                {({ countUpRef }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:hidden w-full">
        {Object.entries(assetCounts).map(([category, count]) => (
          <div
            key={category}
            className="w-full flex flex-col bg-accent rounded-lg border px-4 py-2"
          >
            <span className="text-xs font-regular sm:font-bold text-muted-foreground text-end text-ellipsis overflow-hidden whitespace-nowrap w-full">
              {category.toUpperCase()}
            </span>
            <span className="text-xl sm:text-3xl font-bold text-accent-foreground self-end">
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
      </div>
    </div>
  );
};

export default AssetCounts;
