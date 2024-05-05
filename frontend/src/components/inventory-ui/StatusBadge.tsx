import { useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { hexToRgbA } from '@/lib/utils';

type StatusOptions = {
  value: string;
  color?: string;
}

interface StatusBadgeProps {
  status: string;
  style?: 'ghost' | 'flat' | 'solid';
}

const StatusBadge = ({ status, style='ghost' }: StatusBadgeProps) => {
  const { data: statusValues } = useQuery<StatusOptions[]>({ 
    queryKey: ['fetchOptionValues', 'status'], 
    queryFn: () => imsService.fetchOptionValues('status'),
  });

  const statusValue = statusValues?.find(option => option.value === status);
  const defaultStyle = {
    backgroundColor: '#8d8d8d',
    color: '#ffffff'
  };

  const dot = statusValue ? {
    backgroundColor: (style === 'solid') ? '#fff' : statusValue.color || defaultStyle.backgroundColor,
  } : defaultStyle;

  const flat = statusValue && statusValue.color ? {
    backgroundColor: hexToRgbA(statusValue.color, 0.3),
  } : {
    backgroundColor: hexToRgbA(defaultStyle.backgroundColor, 0.3),
  };

  const solid = statusValue && statusValue.color ? {
    backgroundColor: hexToRgbA(statusValue.color, 1),
    color: defaultStyle.color
  } : {
    backgroundColor: hexToRgbA(defaultStyle.backgroundColor, 0.3),
    color: defaultStyle.color
  };

  const badgeStyle = style === 'ghost' ? {} : (style === 'flat' ? flat : solid);

  return (
    <div className='whitespace-nowrap inline-flex items-center justify-start gap-2 rounded-full px-2 py-[3px] w-fit' style={badgeStyle}>
      <div style={dot} className='h-2.5 w-2.5 rounded-full' />
      <span className='text-foreground'>{status}</span>
    </div>
  );
}

export default StatusBadge;
