import * as React from 'react';
import { cn } from '@/lib/utils';

import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { ScrollBar } from "@/components/ui/scroll-area";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export type OptionType = {
  label: string;
  value: string;
  default: boolean;
};

export type StatusType = {
  value: string;
};

interface MultiSelectProps {
  type: 'retrievable' | 'deployable';
  options: StatusType[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  placeholder: string;
}

const DEFAULT_STATUSES = ['Deployed', 'IT Storage'];

const StatusMultiSelect: React.FC<MultiSelectProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type,
  options,
  selected,
  onChange,
  className,
  placeholder,
  ...props
}) => {
  const [selectOptions, setSelectOptions] = useState<OptionType[]>([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setSelectOptions(
      options.map((option) => ({
        label: option.value,
        value: option.value,
        default: DEFAULT_STATUSES.includes(option.value),
      }))
    );
  }, [options]);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={`w-full justify-between ${
            selected.length > 1 ? 'h-full' : 'h-10'
          }`}
          onClick={() => setOpen(!open)}
        >
          <div className='flex gap-1 flex-wrap'>
            {selected.map((item) => (
              <Badge variant='secondary' key={item} className='mr-1 mb-1'>
                {item}
                {!DEFAULT_STATUSES.includes(item) && (
                  <button
                    className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command className={className}>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No status found.</CommandEmpty>
          <ScrollAreaPrimitive.Root className="relative overflow-hidden">
          <ScrollAreaPrimitive.Viewport className="h-fit max-h-[200px]  w-full rounded-[inherit]">
          <CommandGroup heading="Statuses">
            {selectOptions.map((option) => (
              <CommandItem
                key={option.value}
                disabled={option.default}
                onSelect={() => {
                  onChange(
                    selected.includes(option.value)
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value]
                  );
                  setOpen(true);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          </ScrollAreaPrimitive.Viewport>
                <ScrollBar />
                <ScrollAreaPrimitive.Corner />
              </ScrollAreaPrimitive.Root>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusMultiSelect;
