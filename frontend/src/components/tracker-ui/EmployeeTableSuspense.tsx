import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, PlusIcon, FilterIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react"
import { TableSuspense } from "./TableSuspense"

export function EmployeeTableSuspense () {
  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center pb-2 justify-between">
        <div className="flex items-center -translate-x-4">
          <SearchIcon className="translate-x-8 h-4 w-4"/>
          <Input
            placeholder="Search employee..."
            className="max-w-sm w-[205px] pl-10 h-8 font-light rounded-md text-sm"
            disabled
          />
        </div>
        <div className="flex gap-2 -translate-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-8 w-8 p-0 ml-auto"
          >
            <span className="sr-only">Filter settings</span>
            <FilterIcon className='h-4 w-4'/>
          </Button>
          <Button disabled className="rounded gap-1 font-semibold flex items-center bg-primary text-primary-foreground h-fit p-1.5 px-2 text-sm">
            New
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0  items-center justify-between pb-2">
        <div className="flex w-full items-center space-x-6 lg:space-x-8">
          <div className="flex w-full justify-between items-center">
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
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page 0 of 0
            </div>
            <div className="flex items-center space-x-2">
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
      <TableSuspense length={20} />
    </div>
  )
}
