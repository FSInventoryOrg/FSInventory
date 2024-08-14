import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import classNames from 'react-day-picker/style.module.css';

import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      captionLayout="dropdown"
      startMonth={new Date('1900-01-01')}
      endMonth={new Date('2099-12-31')}
      showOutsideDays={showOutsideDays}
      fixedWeeks={true}
      className={cn('p-3', className)}
      classNames={{
        ...classNames,
        day: 'rounded-md text-sm h-9 w-9 p-0 hover:bg-accent hover:text-accent-foreground',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        chevron: 'fill-primary',
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
