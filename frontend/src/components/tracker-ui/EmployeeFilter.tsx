import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as imsService from '@/ims-service';
import { useQuery } from '@tanstack/react-query';
import { CheckIcon, FilterIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface EmployeeFilterProps {
  onFilter: (filters: string[]) => void;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({ onFilter }) => {
  const [open, setOpen] = React.useState(false);

  const { data: employeePositions } = useQuery<string[]>({ 
    queryKey: ['fetch', 'position'], 
    queryFn: () => imsService.fetchEmployeeUniqueValuesByProperty('position'),
  });

  const [selectedPositions, setSelectedPositions] = React.useState<string[]>([]);
  const [isActiveFilter, setIsActiveFilter] = React.useState<boolean>(true);
  const [isInactiveFilter, setIsInactiveFilter] = React.useState<boolean>(true);
  const [isRegisteredFilter, setIsRegisteredFilter] = React.useState<boolean>(true);
  const [isUnregisteredFilter, setIsUnregisteredFilter] = React.useState<boolean>(true);


  React.useEffect(() => {
    const filters: string[] = [];
    filters.push(...selectedPositions);
    if (isActiveFilter) {
      filters.push('Active');
    }
    if (isInactiveFilter) {
      filters.push('Inactive');
    }
    if (isRegisteredFilter) {
      filters.push('Registered');
    }
    if (isUnregisteredFilter) {
      filters.push('Unregistered');
    }
  
    onFilter(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPositions, isActiveFilter, isInactiveFilter, isRegisteredFilter, isUnregisteredFilter]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='icon' className='p-0 h-8 min-w-8 w-8'>
          <span className="sr-only">Filter employees</span>
          <FilterIcon className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <ScrollArea className='h-[300px]'>
          <Label className='flex text-xs text-accent-foreground p-2'>POSITION</Label>
          <Separator className='bg-accent' />
          <div className='p-1'>
            {employeePositions &&         
              (employeePositions.slice().sort().map((position, index) => {
                const isSelected = selectedPositions.includes(position);
                return (
                  <Button 
                    key={index} 
                    className='flex justify-start items-center gap-2 text-sm w-full px-2 py-1.5 h-fit rounded' 
                    variant='ghost'
                    onClick={() => {
                      const newSelectedPositions = isSelected
                        ? selectedPositions.filter((p) => p !== position)
                        : [...selectedPositions, position];
                      setSelectedPositions(newSelectedPositions);
                      setOpen(true);
                    }}
                  >
                    <CheckIcon size={16} className={`${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    {position}
                  </Button>
                )
              }))
            }
          </div>
          <Separator className='bg-accent' />
          <Label className='flex text-xs text-accent-foreground p-2'>STATUS</Label>
          <Separator className='bg-accent' />
          <div className='p-1'>
            <Button
              className='flex justify-start items-center gap-2 text-sm w-full px-2 py-1.5 h-fit rounded' 
              variant='ghost'
              onClick={() => {
                setIsActiveFilter(!isActiveFilter);
                setOpen(true);
              }}
            >
              <CheckIcon size={16} className={`${isActiveFilter ? 'opacity-100' : 'opacity-0'}`} />
              Active
            </Button>
            <Button
              className='flex justify-start items-center gap-2 text-sm w-full px-2 py-1.5 h-fit rounded' 
              variant='ghost'
              onClick={() => {
                setIsInactiveFilter(!isInactiveFilter);
                setOpen(true);
              }}
            >
              <CheckIcon size={16} className={`${isInactiveFilter ? 'opacity-100' : 'opacity-0'}`} />
              Inactive
            </Button>
            <Button
              className='flex justify-start items-center gap-2 text-sm w-full px-2 py-1.5 h-fit rounded' 
              variant='ghost'
              onClick={() => {
                setIsRegisteredFilter(!isRegisteredFilter);
                setOpen(true);
              }}
            >
              <CheckIcon size={16} className={`${isRegisteredFilter ? 'opacity-100' : 'opacity-0'}`} />
              Registered
            </Button>
            <Button
              className='flex justify-start items-center gap-2 text-sm w-full px-2 py-1.5 h-fit rounded' 
              variant='ghost'
              onClick={() => {
                setIsUnregisteredFilter(!isUnregisteredFilter);
                setOpen(true);
              }}
            >
              <CheckIcon size={16} className={`${isUnregisteredFilter ? 'opacity-100' : 'opacity-0'}`} />
              Unregistered
            </Button>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default EmployeeFilter;
