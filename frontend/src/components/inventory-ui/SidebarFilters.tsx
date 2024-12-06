"use client";

import React from "react";
import {
  CodeIcon,
  FilterIcon,
  MonitorSmartphoneIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CountUp from "react-countup";
import * as imsService from "@/ims-service";
import { useQuery } from "@tanstack/react-query";
import { HardwareType, SoftwareType } from "@/types/asset";
import { Skeleton } from "../ui/skeleton";

interface SidebarFiltersProps {
  onTypeChange: (type: string) => void;
  onFilterChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onProcessorChange: (processor: string) => void;
  onMemoryChange: (memory: string) => void;
  onStorageChange: (storage: string) => void;
  onToggleFilters: (visible: boolean) => void;
  isFiltersVisible: boolean;
  selectedType: string;
  selectedStatus: string;
  selectedCategory: string;
  selectedSystemSpecs: Record<string, string>;
  totalAssets: number;
}

const SidebarFilters = ({
  onTypeChange,
  onFilterChange,
  onCategoryChange,
  onProcessorChange,
  onMemoryChange,
  onStorageChange,
  onToggleFilters,
  isFiltersVisible,
  selectedType,
  selectedStatus,
  selectedCategory,
  selectedSystemSpecs,
  totalAssets,
}: SidebarFiltersProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["fetchAllAssets", selectedType],
    queryFn: () => imsService.fetchAllAssets(selectedType),
  });
  const statusCounts: Record<string, number> = {};
  const categoriesCounts: Record<string, number> = {};
  const softwareCategories = new Set<string>();
  const hardwareCategories = new Set<string>();
  const processors = new Array<string>();
  const memories = new Array<string>();
  const storage = new Array<string>();

  const [prevTotalAssets, setPrevTotalAssets] = React.useState<number>(0);

  if (data) {
    const processorSet = new Set<string>();
    const memorySet = new Set<string>();
    const storageSet = new Set<string>();

    data.forEach((asset: HardwareType | SoftwareType) => {
      statusCounts[asset.status] = (statusCounts[asset.status] || 0) + 1;

      asset.type === "Software" && softwareCategories.add(asset.category);
      asset.type === "Hardware" && hardwareCategories.add(asset.category);
      categoriesCounts[asset.category] =
        (categoriesCounts[asset.category] || 0) + 1;

      if (asset.type === "Hardware") {
        asset.processor && processorSet.add(asset.processor);
        asset.memory && memorySet.add(asset.memory);
        asset.storage && storageSet.add(asset.storage);
      }
    });
    processors.push(...processorSet);
    processors.sort((a, b) =>
      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
    );

    memories.push(...memorySet);
    memories.sort((a, b) =>
      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
    );

    storage.push(...storageSet);
    storage.sort((a, b) =>
      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
    );
  }

  const handleStatusClick = (status: string) => {
    onFilterChange(status);
    setPrevTotalAssets(totalAssets);
  };

  const resetFilterSettings = () => {
    handleStatusClick("all");
    onCategoryChange("all");
    onProcessorChange("all");
    onMemoryChange("all");
    onStorageChange("all");
  };

  const handleTypeClick = (type: string) => {
    if (type !== selectedType) {
      onTypeChange(type);
      resetFilterSettings();
    } else {
      onTypeChange("");
    }
  };

  return (
    <section className="w-full flex flex-col">
      <div className="flex items-end justify-between mr-8 pb-3 xl:pb-4">
        <h1 className="text-xl font-semibold tracking-wide">Assets</h1>
        {isLoading ? (
          <Skeleton className="bg-muted w-[120px] rounded-xl h-8 border-border border-2" />
        ) : (
          <div className="text-sm font-semibold border-2 rounded-xl px-3 text-muted-foreground h-8 justify-center items-center flex gap-1">
            <span className="text-base text-secondary-foreground">
              <CountUp
                start={prevTotalAssets}
                end={totalAssets}
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
            total assets
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row xl:flex-col drop-shadow">
        <div className="w-full bg-accent rounded-b-none rounded-t-md sm:rounded-l-md xl:rounded-b-none xl:rounded-t-md p-4 pb-8 flex flex-col gap-4 ">
          <h2 className="font-semibold flex gap-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8 min-w-8 p-0 bg-inherit"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      onToggleFilters(!isFiltersVisible);
                    }}
                  >
                    <span className="sr-only">Toggle filter settings</span>
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Hide filter settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Filter Settings
          </h2>
          <div className="flex flex-col gap-2">
            <span className="uppercase font-semibold text-xs text-accent-foreground tracking-wide">
              Type
            </span>
            <div className="flex gap-2 w-full md:w-fit xl:w-full">
              <Button
                variant="outline"
                className={`bg-muted rounded-xl border-2 flex w-full justify-between h-fit py-1.5 px-2 text-xs gap-2  ${selectedType === "Hardware" ? "border-primary" : ""}`}
                onClick={() => handleTypeClick("Hardware")}
              >
                Hardware
                <MonitorSmartphoneIcon size={18} />
              </Button>
              <Button
                variant="outline"
                className={`bg-muted rounded-xl border-2 flex w-full justify-between h-fit py-1.5 px-2 text-xs gap-2  ${selectedType === "Software" ? "border-primary" : ""}`}
                onClick={() => handleTypeClick("Software")}
              >
                Software
                <CodeIcon size={18} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase font-semibold text-xs text-accent-foreground tracking-wide">
              Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-2 gap-2">
              {isLoading ? (
                <>
                  {Array.from({ length: 10 }, (_, index) => (
                    <Button
                      key={index}
                      disabled
                      variant="outline"
                      className="bg-muted rounded-xl border-2 flex w-full justify-end px-2 h-9"
                    >
                      <Skeleton className="rounded-lg h-5 w-[30px] bg-secondary" />
                    </Button>
                  ))}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className={`bg-muted rounded-xl border-2 flex w-full justify-between h-fit py-1.5 px-2 ${selectedStatus === "" ? "border-primary" : ""}`}
                    onClick={() => handleStatusClick("all")}
                  >
                    <span className="w-[100px] text-start overflow-hidden text-ellipsis text-xs">
                      All
                    </span>
                    <div
                      className={`rounded-lg px-2 py-0.5 text-xs ${selectedStatus === "" ? "bg-primary/30 text-primary" : "bg-secondary text-secondary-foreground"}`}
                    >
                      {data?.length}
                    </div>
                  </Button>
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <Button
                      key={status}
                      variant="outline"
                      className={`bg-muted rounded-xl border-2 flex w-full justify-between h-fit py-1.5 px-2 ${selectedStatus === status ? "border-primary" : ""}`}
                      onClick={() => handleStatusClick(status)}
                    >
                      <span className="w-[100px] text-start overflow-hidden text-ellipsis text-xs">
                        {status}
                      </span>
                      <div
                        className={`ml-1 rounded-lg px-2 py-0.5 text-xs ${selectedStatus === status ? "bg-primary/30 text-primary" : "bg-secondary text-secondary-foreground"}`}
                      >
                        {count}
                      </div>
                    </Button>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase font-semibold text-xs text-accent-foreground tracking-wide">
              Category
            </span>
            <div className="flex gap-2">
              {isLoading ? (
                <Select disabled>
                  <SelectTrigger className="w-full rounded-xl border-2 font-semibold">
                    <SelectValue placeholder="All assets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Hardware</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  onValueChange={onCategoryChange}
                  value={selectedCategory}
                >
                  <SelectTrigger className="w-full rounded-xl border-2 font-semibold">
                    <SelectValue placeholder="All assets" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedType !== "Software" && (
                      <SelectGroup>
                        <SelectLabel>Hardware</SelectLabel>
                        <SelectItem value="all">All</SelectItem>
                        {[...hardwareCategories].map((category: string) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="w-full"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    {selectedType !== "Hardware" && (
                      <SelectGroup>
                        <SelectLabel>Software</SelectLabel>
                        <SelectItem value="all">All</SelectItem>
                        {[...softwareCategories].map((category: string) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="w-full"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase font-semibold text-xs text-accent-foreground tracking-wide">
              Processor
            </span>
            <div className="flex gap-2">
              <Select
                disabled={isLoading}
                onValueChange={onProcessorChange}
                value={selectedSystemSpecs.processor}
              >
                <SelectTrigger className="w-full rounded-xl border-2 font-semibold">
                  <SelectValue placeholder="All" />
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {[...processors].map((processor: string) => (
                      <SelectItem
                        key={processor}
                        value={processor}
                        className="w-full"
                      >
                        {processor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase font-semibold text-xs text-accent-foreground tracking-wide">
              Memory
            </span>
            <div className="flex gap-2">
              <Select
                disabled={isLoading}
                onValueChange={onMemoryChange}
                value={selectedSystemSpecs.memory}
              >
                <SelectTrigger className="w-full rounded-xl border-2 font-semibold">
                  <SelectValue placeholder="All" />
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {[...memories].map((memory: string) => (
                      <SelectItem
                        key={memory}
                        value={memory}
                        className="w-full"
                      >
                        {memory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase font-semibold text-xs text-accent-foreground tracking-wide">
              Storage
            </span>
            <div className="flex gap-2">
              <Select
                disabled={isLoading}
                onValueChange={onStorageChange}
                value={selectedSystemSpecs.storage}
              >
                <SelectTrigger className="w-full rounded-xl border-2 font-semibold">
                  <SelectValue placeholder="All" />
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {[...storage].map((strg: string) => (
                      <SelectItem key={strg} value={strg} className="w-full">
                        {strg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </div>
        <Button
          className="h-full gap-2 rounded-t-none rounded-b-md sm:rounded-l-none sm:rounded-r-md xl:rounded-t-none xl:rounded-b-md w-full sm:w-28 xl:w-full text-sm sm:text-lg xl:gap-2 py-8"
          onClick={() => window.location.reload()}
        >
          <RefreshCcwIcon size={20} /> Reset
        </Button>
      </div>
    </section>
  );
};

export default SidebarFilters;
