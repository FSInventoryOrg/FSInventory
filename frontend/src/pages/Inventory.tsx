'use client';

import React from 'react';
import SidebarFilters from '@/components/inventory-ui/SidebarFilters';
import { InventoryTable } from '@/components/inventory-ui/InventoryTable';
import { InventoryColumns } from '@/components/inventory-ui/InventoryColumns';
import * as imsService from '@/ims-service';
import { useQuery } from '@tanstack/react-query';
import { InventoryTableSuspense } from '@/components/inventory-ui/InventoryTableSuspense';

const Inventory = () => {
  const [selectedStatus, setSelectedStatus] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [isFiltersVisible, setIsFiltersVisible] = React.useState<boolean>(true);

  const handleFilterChange = (status: string) => {
    if (status === 'all' ) {
      setSelectedStatus('');
    } else {
      setSelectedStatus(status);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'all' ) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  const handleToggleFilters = () => {
    setIsFiltersVisible((prev) => !prev);
  }

  const { data } = useQuery({ 
    queryKey: ['fetchAllAssetsByStatusAndCategory', 'Hardware', selectedStatus, selectedCategory], 
    queryFn: () => imsService.fetchAllAssetsByStatusAndCategory('Hardware', selectedStatus, selectedCategory) 
  })

  return (
    <section id="inventory" className="flex flex-col xl:flex-row gap-6 w-full px-6 pb-6 pt-3" style={{ height: 'calc(100vh - 91px)' }}>
      {isFiltersVisible && (
        <aside className="order-first flex xl:w-80 z-50">
          <SidebarFilters
            onFilterChange={handleFilterChange}
            onCategoryChange={handleCategoryChange}
            selectedStatus={selectedStatus}
            selectedCategory={selectedCategory}
            totalAssets={data?.length ?? 0}
          />
        </aside>
      )}
      <main className="flex-1 flex gap-4 w-full">
        {data ? (
          <InventoryTable
            onToggleFilters={handleToggleFilters} 
            isFiltersVisible={isFiltersVisible} 
            columns={InventoryColumns} 
            data={data} 
            selectedCategory={selectedCategory} 
          /> 
        ) : ( 
          <InventoryTableSuspense />
        )}
      </main>
    </section>
  )
}

export default Inventory;