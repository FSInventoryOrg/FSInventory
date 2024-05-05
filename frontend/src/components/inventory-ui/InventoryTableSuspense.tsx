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

export function InventoryTableSuspense () {
  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center pb-4 justify-between">
        <div className="flex items-center w-[700px] -translate-x-4">
          <SearchIcon className="translate-x-8 h-4 w-4"/>
          <Input
            placeholder="Search asset..."
            className="max-w-sm pl-10 h-8 font-light rounded-md text-sm"
            disabled
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-8 w-8 p-0 ml-auto"
          >
            <span className="sr-only">Toggle visible columns</span>
            <SlidersHorizontalIcon className='h-4 w-4'/>
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-8 w-8 p-0 ml-auto"
          >
            <span className="sr-only">Toggle visible columns</span>
            <FilterIcon className='h-4 w-4'/>
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-8 w-8 p-0 ml-auto"
          >
            <span className="sr-only">Toggle visible columns</span>
            <Columns3Icon className='h-4 w-4'/>
          </Button>
          <Button disabled className="rounded gap-1 font-semibold flex items-center bg-primary text-primary-foreground h-fit p-1.5 px-2 text-sm">
            Add Asset
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <TableSuspense />
      <div className="flex items-center justify-between pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          0 of{" "}
          0 row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
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
