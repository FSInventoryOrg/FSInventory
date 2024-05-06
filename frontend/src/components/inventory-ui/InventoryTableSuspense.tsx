"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, PlusIcon, Columns3Icon, FilterIcon, SlidersHorizontalIcon } from "lucide-react"
import { TableSuspense } from "../tracker-ui/TableSuspense"
import React from "react"

interface InventoryTableSuspenseProps {
  onToggleFilters: (visible: boolean) => void;
  isFiltersVisible: boolean;
}

export function InventoryTableSuspense ({ onToggleFilters, isFiltersVisible}: InventoryTableSuspenseProps) {
  const [isMD, setIsMD] = React.useState(false);
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMD(window.innerWidth >= 768); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-between pb-4 gap-2">
        <div className="flex gap-2 w-full">
          {!isFiltersVisible && (
            <Button
              className='h-8 w-8 min-w-8 p-0'
              variant='outline'
              size='icon'
              onClick={() => {
                onToggleFilters(!isFiltersVisible);
              }}
            >
              <span className="sr-only">Toggle sidebar filters</span>
              <FilterIcon className='h-4 w-4' />
            </Button>
          )}
          <div className="flex items-center w-full">
            <SearchIcon className="absolute translate-x-3 h-4 w-4"/>
            <Input
              placeholder="Search asset..."
              className="w-full pl-10 h-8 font-light rounded-md text-sm md:w-[700px]"
              disabled
            />
          </div>
        </div>
        <div className="flex gap-2 w-fit">
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-8 w-8 min-w-8 p-0"
          >
            <span className="sr-only">Toggle option settings</span>
            <SlidersHorizontalIcon className='h-4 w-4'/>
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-8 w-8 min-w-8 p-0"
          >
            <span className="sr-only">Toggle visible columns</span>
            <Columns3Icon className='h-4 w-4'/>
          </Button>
          <Button disabled className="gap-1 font-semibold flex items-center h-8 p-1.5 px-2 text-sm">
            <span className="hidden md:inline-block text-sm">Add Asset</span>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <TableSuspense />
      <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          0 of{" "}
          0 row(s) selected.
        </div>
        <div className="flex w-full sm:w-fit items-center justify-between sm:justify-normal space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            {isMD && <p className="text-sm font-medium">Rows per page</p>}
            <Select disabled>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={10} />
              </SelectTrigger>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page 0 of{" "}
            0
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              disabled
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              disabled
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
