import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('w-full pr-4 pb-4', className)}>
      <div className="h-full bg-muted rounded-lg drop-shadow">{children}</div>
    </div>
  );
};

export const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'p-3 sm:p-6 flex flex-col gap-3 sm:gap-6 h-full',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  subtitle,
  children,
  className,
}: {
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div>
      <h2
        className={cn('font-medium text-muted-foreground text-sm', className)}
      >
        {subtitle}
      </h2>
      <h1
        className={cn(
          'text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis',
          className
        )}
      >
        {children}
      </h1>
      <Separator className="mt-3 h-[2px]" />
    </div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('my-auto overflow-x-auto overflow-y-hidden', className)}>
      {children}
    </div>
  );
};
