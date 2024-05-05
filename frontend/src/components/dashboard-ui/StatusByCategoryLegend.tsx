import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';


type StatusCount = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

type CategoryCountByStatus = {
  status: string;
  [key: string]: number | string;
}


interface Props {
  statusCount: StatusCount[];
  categoryCountByStatus: CategoryCountByStatus[];
}

const StatusByCategoryLegend = ({ statusCount, categoryCountByStatus }: Props) => {

  const getCategoriesForStatus = (label: string) => {
    const statusData = categoryCountByStatus.find(entry => entry.status === label);
    if (statusData) {
      return Object.keys(statusData)
        .filter(field => field !== 'status' && !field.endsWith('Color'))
        .map(field => ({ category: field, count: statusData[field] }));
    }
    return [];
  };


  return (
    <div>
      {statusCount.map(({ label, value, percentage, color }, index) => (
        <div key={`category-${index}`} className="flex gap-2 items-center w-full text-xs opacity-85 hover:opacity-100 hover:cursor-default" >
          <div  
            className='border-0 w-4 h-4 rounded-none'           
            style={{ backgroundColor: color }} 
          />
          <TooltipProvider delayDuration={100} >
            <Tooltip>
              <TooltipTrigger>
                <span className='text-secondary-foreground text-sm'>{label}</span>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <h3 className='font-semibold'>{label}</h3>
                <Separator className='my-1' />
                <ul>
                  {/* Iterate over categories for the current status */}
                  {getCategoriesForStatus(label).map(({ category, count }) => (
                    <li key={category}>
                      {category}: <span className='font-semibold'>{count}</span>
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="flex-grow border-t border-border rounded-full"></span>
          <span className='ml-auto text-primary font-bold'>{value}</span>
          <span className='text-xs text-muted-foreground'>({percentage.toFixed(2)}%)</span>
        </div>
      ))}
    </div>
  )
}

export default StatusByCategoryLegend