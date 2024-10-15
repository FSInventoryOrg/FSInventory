import { RadioGroupItem } from '@/components/ui/radio-group';
import { capitalize } from '@/lib/utils';

interface DaysOptionProps {
  id: string;
  label: 'default' | 'custom' | 'maximum';
  value: number;
  checked?: boolean;
  onChange?: (value: number) => void;
  children?: React.ReactNode;
}

const DaysOption: React.FC<DaysOptionProps> = ({
  id,
  label,
  value,
  checked,
  onChange,
  children,
}) => {

  const handeClick = () => {
    onChange?.(value)
  }
  return (
    <div className={`rounded-md border p-3 ${checked ? 'bg-secondary' : ''}`}>
      <div className="flex flex-row gap-3">
        <RadioGroupItem
          className="mt-1"
          value={label}
          id={id}
          onClick={handeClick}
        />
        <div className="flex flex-col gap-1">
          <h2 className="font-medium text-muted-foreground text-sm">
            {capitalize(label)}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DaysOption;
