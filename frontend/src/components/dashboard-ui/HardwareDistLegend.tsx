type CategoryCount = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface Props {
  categoryCount: CategoryCount[]
}


const HardwareDistLegend = ({ categoryCount }: Props) => {
  const totalCount = categoryCount.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <div className='w-full flex flex-col gap-0'>
      {categoryCount.map(({ label, value, percentage, color }, index) => (
        <div key={`category-${index}`} className="flex gap-2 items-center w-full opacity-85 hover:opacity-100 hover:cursor-default" >
          <div  
            className='border-0 h-2 w-5 rounded-full'           
            style={{ backgroundColor: color }} 
          />
          <span className='font-medium text-secondary-foreground text-sm'>{label}</span>
          <span className="flex-grow border-t border-border rounded-full"></span>
          <span className='ml-auto text-primary font-bold text-sm'>{value}</span>
          <span className='text-xs text-muted-foreground'>({percentage.toFixed(2)}%)</span>
        </div>
      ))}
      <div className="flex gap-2 items-center w-full opacity-85 hover:opacity-100 hover:cursor-default">
        <span className="font-medium text-secondary-foreground text-md">Total</span>
        <span className="flex-grow border-t border-border rounded-full"></span>
        <span className="ml-auto text-primary font-bold text-sm">{totalCount}</span>
      </div>
    </div>
  )
}

export default HardwareDistLegend