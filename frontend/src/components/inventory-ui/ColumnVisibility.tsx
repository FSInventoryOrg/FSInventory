import * as React from 'react'
import { cn } from "@/lib/utils"
import { CheckIcon, Columns3Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import { Table } from "@tanstack/react-table"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from '@/components/ui/scroll-area'

interface InventoryFilterProps<TData> {
  table: Table<TData>
}

export function ColumnVisibility<TData>({
  table,
}: InventoryFilterProps<TData>) {

    const [open, setOpen] = React.useState(false)
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Toggle visible columns</span>
              <Columns3Icon className='h-4 w-4'/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
              <Command>
                  <CommandInput placeholder="Search ..." />
                  <CommandEmpty>No item found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[300px]" >
                      {table
                        .getAllColumns()
                        .filter(
                          (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                        )
                        .map((column) => {
                          return (
                            <CommandItem
                                key={column.id}
                                onSelect={(value) => {
                                  column.toggleVisibility(column.getIsVisible() ? !value : !!value);
                                  setOpen(true)
                                }}
                            >
                                <CheckIcon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        column.getIsVisible() ?
                                            "opacity-100" : "opacity-0"
                                    )}
                                />
                                {column.id}
                            </CommandItem>
                          )
                      })}
                    </ScrollArea>
                  </CommandGroup>
              </Command>
          </PopoverContent>
        </Popover>
    )
}
