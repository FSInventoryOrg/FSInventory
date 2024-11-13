import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as imsService from "@/ims-service";
import { useQuery } from "@tanstack/react-query";
import { FilterIcon, SearchIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface EmployeeFilterProps {
  onFilter: (filters: string[]) => void;
  dataCount: number;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  onFilter,
  dataCount,
}) => {
  const [open, setOpen] = React.useState(false);

  const { data: employeePositions } = useQuery<string[]>({
    queryKey: ["fetch", "position"],
    queryFn: () => imsService.fetchEmployeeUniqueValuesByProperty("position"),
  });

  const [selectedPositions, setSelectedPositions] = React.useState<string[]>(
    []
  );
  const [isActiveFilter, setIsActiveFilter] = React.useState<boolean>(false);
  const [isInactiveFilter, setIsInactiveFilter] =
    React.useState<boolean>(false);
  const [isRegisteredFilter, setIsRegisteredFilter] =
    React.useState<boolean>(false);
  const [isUnregisteredFilter, setIsUnregisteredFilter] =
    React.useState<boolean>(false);
  const [searchPositionText, setSearchPosiitonText] = React.useState("");

  React.useEffect(() => {
    let filters: string[] = [];

    filters.push(...selectedPositions);
    if (isActiveFilter) {
      filters.push("Active");
    }
    if (isInactiveFilter) {
      filters.push("Inactive");
    }
    if (isRegisteredFilter) {
      filters.push("Registered");
    }
    if (isUnregisteredFilter) {
      filters.push("Unregistered");
    }

    if (filters.length === 0)
      filters = ["Active", "Inactive", "Registered", "Unregistered"];

    onFilter(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPositions,
    isActiveFilter,
    isInactiveFilter,
    isRegisteredFilter,
    isUnregisteredFilter,
  ]);

  const viewText = () => {
    return dataCount > 0 ? `View ${dataCount}` : "No Results";
  };

  const handleClearFilters = () => {
    setSelectedPositions([]);
    setIsActiveFilter(false);
    setIsInactiveFilter(false);
    setIsRegisteredFilter(false);
    setIsUnregisteredFilter(false);
    setSearchPosiitonText("");
  };

  const isClearFiltersDisabled =
    !isActiveFilter &&
    !isInactiveFilter &&
    !isRegisteredFilter &&
    !isUnregisteredFilter &&
    selectedPositions.length === 0 &&
    searchPositionText === "";

  const filteredEmployeePositions = React.useMemo(() => {
    if (employeePositions)
      return employeePositions.filter((pos) => {
        return pos
          .toLowerCase()
          .includes(searchPositionText.trim().toLowerCase());
      });
    return null;
  }, [searchPositionText, employeePositions]);

  const handlePositionClick = (position: string) => {
    const isSelected = selectedPositions.includes(position);
    const newSelectedPositions = isSelected
      ? selectedPositions.filter((p) => p !== position)
      : [...selectedPositions, position];
    setSelectedPositions(newSelectedPositions);
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="p-0 h-8 min-w-8 w-8"
              >
                <span className="sr-only">Filter employees</span>
                <FilterIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Filter employees</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="p-0 w-[310px]">
        <Accordion
          type="multiple"
          defaultValue={["item-1", "item-2", "item-3"]}
        >
          <AccordionItem value="item-1" className="border-accent grid">
            <AccordionTrigger className="p-2">
              <Label className="flex text-xs text-accent-foreground">
                STATUS
              </Label>
            </AccordionTrigger>
            <AccordionContent className="py-1">
              <Separator className="bg-accent" />
              <div className="p-1  grid grid-cols-2">
                <Button
                  className="flex text-left justify-start items-center px-2 w-full gap-2 text-sm py-1.5 h-fit rounded whitespace-normal"
                  variant="ghost"
                  onClick={() => {
                    setIsActiveFilter(!isActiveFilter);
                    setOpen(true);
                  }}
                >
                  <Checkbox
                    checked={isActiveFilter}
                    aria-label="Select Active"
                    className="bg-white"
                  />
                  Active
                </Button>
                <Button
                  className="flex text-left justify-start items-center px-2 w-full gap-2 text-sm py-1.5 h-fit rounded whitespace-normal"
                  variant="ghost"
                  onClick={() => {
                    setIsInactiveFilter(!isInactiveFilter);
                    setOpen(true);
                  }}
                >
                  <Checkbox
                    checked={isInactiveFilter}
                    aria-label="Select Active"
                    className="bg-white"
                  />
                  Inactive
                </Button>
                <Button
                  className="flex text-left justify-start items-center px-2 w-full gap-2 text-sm py-1.5 h-fit rounded whitespace-normal"
                  variant="ghost"
                  onClick={() => {
                    setIsRegisteredFilter(!isRegisteredFilter);
                    setOpen(true);
                  }}
                >
                  <Checkbox
                    checked={isRegisteredFilter}
                    aria-label="Select Active"
                    className="bg-white"
                  />
                  Registered
                </Button>
                <Button
                  className="flex text-left justify-start items-center px-2 w-full gap-2 text-sm py-1.5 h-fit rounded whitespace-normal"
                  variant="ghost"
                  onClick={() => {
                    setIsUnregisteredFilter(!isUnregisteredFilter);
                    setOpen(true);
                  }}
                >
                  <Checkbox
                    checked={isUnregisteredFilter}
                    aria-label="Select Active"
                    className="bg-white"
                  />
                  Unregistered
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-b-0 border-accent">
            <AccordionTrigger className="p-2">
              <Label className="flex text-xs text-accent-foreground">
                POSITION
              </Label>
            </AccordionTrigger>
            <AccordionContent className="py-1">
              <Separator className="bg-accent" />
              <div className="flex items-center w-full my-2">
                <SearchIcon className="absolute translate-x-6 h-4 w-4" />
                <Input
                  placeholder="Search position"
                  value={searchPositionText}
                  onChange={(event) =>
                    setSearchPosiitonText(event.target.value)
                  }
                  className="max-w-sm w-full pl-9 h-8 font-light rounded-[4px] text-sm mx-3"
                />
              </div>
              <ScrollArea className="h-[300px] ">
                <div className="p-1">
                  {filteredEmployeePositions &&
                    filteredEmployeePositions
                      .slice()
                      .sort()
                      .map((position, index) => {
                        const isSelected = selectedPositions.includes(position);
                        return (
                          <Button
                            key={index}
                            className="flex text-left justify-start items-center px-2 w-full gap-2 text-sm py-1.5 h-fit rounded whitespace-normal"
                            variant="ghost"
                            onClick={() => handlePositionClick(position)}
                          >
                            <Checkbox
                              checked={isSelected}
                              aria-label={`Select ${position}`}
                              className="bg-white"
                            />
                            {position}
                          </Button>
                        );
                      })}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-b-0 border-accent">
            <Separator className="bg-accent" />
            <div className="p-2 flex gap-3">
              <Button
                className="w-1/2 bg-[#244242] hover:bg-[#244242] text-white hover:bg-opacity-70"
                onClick={handleClearFilters}
                disabled={isClearFiltersDisabled}
              >
                Clear Filters
              </Button>
              <Button
                className="w-1/2"
                disabled={dataCount === 0}
                onClick={() => setOpen(false)}
              >
                {viewText()}
              </Button>
            </div>
          </AccordionItem>
        </Accordion>
      </PopoverContent>
    </Popover>
  );
};

export default EmployeeFilter;
