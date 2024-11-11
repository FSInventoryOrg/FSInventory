"use client";

import React from "react";
import SidebarFilters from "@/components/inventory-ui/SidebarFilters";
import { InventoryTable } from "@/components/inventory-ui/InventoryTable";
import { InventoryColumns } from "@/components/inventory-ui/InventoryColumns";
import * as imsService from "@/ims-service";
import { useQuery } from "@tanstack/react-query";
import { InventoryTableSuspense } from "@/components/inventory-ui/InventoryTableSuspense";
import { Defaults } from "@/types/options";
import { PROPERTIES } from "@/lib/data";
import { AssetType } from "@/types/asset";

const Inventory = () => {
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [selectedSystemSpecs, setSelectedSystemSpecs] = React.useState<
    Record<string, string>
  >({ processor: "", memory: "", storage: "" });
  const [isFiltersVisible, setIsFiltersVisible] = React.useState<boolean>(true);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleFilterChange = (status: string) => {
    setSelectedStatus(status === "all" ? "" : status);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "all" ? "" : category);
  };

  const handleProcessorChange = (processor: string) => {
    setSelectedSystemSpecs((prev) => ({
      ...prev,
      processor: processor === "all" ? "" : processor,
    }));
  };

  const handleMemoryChange = (memory: string) => {
    setSelectedSystemSpecs((prev) => ({
      ...prev,
      memory: memory === "all" ? "" : memory,
    }));
  };

  const handleStorageChange = (storage: string) => {
    setSelectedSystemSpecs((prev) => ({
      ...prev,
      storage: storage === "all" ? "" : storage,
    }));
  };

  const handleToggleFilters = () => {
    setIsFiltersVisible((prev) => !prev);
  };

  const { data } = useQuery({
    queryKey: [
      "fetchAllAssetsByStatusAndCategory",
      selectedType,
      selectedStatus,
      selectedCategory,
      selectedSystemSpecs,
    ],
    queryFn: () =>
      imsService.fetchAssetsByFilter({
        type: selectedType,
        status: selectedStatus,
        category: selectedCategory,
        processor: selectedSystemSpecs.processor,
        memory: selectedSystemSpecs.memory,
        storage: selectedSystemSpecs.storage,
      }),
  });

  const { data: defaultOptions } = useQuery<Defaults>({
    queryKey: ["fetchOptionValues", "defaults"],
    queryFn: () => imsService.fetchOptionValues("defaults"),
  });

  let DEFAULT_HIDDEN_COLUMNS: string[] = [];
  if (defaultOptions?.inventoryColumns) {
    DEFAULT_HIDDEN_COLUMNS = PROPERTIES.filter(
      (property) => !defaultOptions.inventoryColumns?.includes(property.id)
    ).map((property) => property.id);
  }

  const [height, setHeight] = React.useState("calc(100vh - 91px)");
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setHeight("calc(100vh - 91px)");
      } else {
        setHeight("");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="inventory"
      className=" flex flex-col xl:flex-row gap-3 sm:gap-6 px-3 pb-3 sm:px-6 sm:pb-6 pt-3"
      style={{ height, width: "calc(100vw - 10px)" }}
    >
      {isFiltersVisible && (
        <aside className="order-first flex xl:w-80 z-50">
          <SidebarFilters
            onTypeChange={handleTypeChange}
            onFilterChange={handleFilterChange}
            onCategoryChange={handleCategoryChange}
            onProcessorChange={handleProcessorChange}
            onMemoryChange={handleMemoryChange}
            onStorageChange={handleStorageChange}
            onToggleFilters={handleToggleFilters}
            isFiltersVisible={isFiltersVisible}
            selectedType={selectedType}
            selectedStatus={selectedStatus}
            selectedCategory={selectedCategory}
            selectedSystemSpecs={selectedSystemSpecs}
            totalAssets={data?.length ?? 0}
          />
        </aside>
      )}
      <main className="flex-1 flex gap-4 w-full">
        {data ? (
          <InventoryTable
            columns={InventoryColumns}
            data={data}
            defaultOptions={defaultOptions || {}}
            DEFAULT_HIDDEN_COLUMNS={DEFAULT_HIDDEN_COLUMNS}
            onToggleFilters={handleToggleFilters}
            isFiltersVisible={isFiltersVisible}
            selectedCategory={selectedCategory}
            selectedType={selectedType as AssetType["type"]}
          />
        ) : (
          <InventoryTableSuspense
            onToggleFilters={handleToggleFilters}
            isFiltersVisible={isFiltersVisible}
          />
        )}
      </main>
    </section>
  );
};

export default Inventory;
