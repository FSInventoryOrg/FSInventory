import * as React from 'react';
import { DayPicker, DropdownProps, useDayPicker } from 'react-day-picker';
import classNames from 'react-day-picker/style.module.css';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const CustomDropdown = (props: DropdownProps) => {
  const { months, goToMonth } = useDayPicker();
  const currentMonth = new Date(
    months[0].date.getFullYear(),
    months[0].date.getMonth()
  );

  const handleValueChange = (value: string) => {
    const label = props['aria-label']?.toLocaleLowerCase();
    const newMonth = new Date(currentMonth);

    if (label?.includes('month')) {
      newMonth.setMonth(Number(value));
    } else if (label?.includes('year')) {
      newMonth.setFullYear(Number(value));
    }
    goToMonth(newMonth);
  };

  return (
    <Select value={props.value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={props['aria-label']} />
      </SelectTrigger>
      <SelectContent>
        {props.options?.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

function Calendar({
  className,
  showOutsideDays = true,
  startMonth = new Date('1900-01-01'),
  endMonth = new Date('2099-12-31'),
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      captionLayout="dropdown"
      startMonth={startMonth}
      endMonth={endMonth}
      showOutsideDays={showOutsideDays}
      fixedWeeks={true}
      className={cn('p-3', className)}
      classNames={{
        ...classNames,
        chevron: 'fill-primary',
        day: 'rounded-md text-sm h-9 w-9 p-0 hover:bg-accent hover:text-accent-foreground',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        month_caption: 'flex gap-1 justify-center',
        nav: 'absolute flex items-center justify-between w-full px-1',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
      }}
      components={{
        Dropdown: (props: DropdownProps) => <CustomDropdown {...props} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
