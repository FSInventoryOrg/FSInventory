import { RadioGroup } from '@/components/ui/radio-group';
import DaysOption from './DaysOption';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface DaysOptionsProps {
  value: number; 
  onChange: (value: number) => void; 
  onBlur?: () => void;
}

const getSelectedOption = (val: number) => {
  if (val === undefined || val === 5) return 'default';
  return val > 0 && val < 365 ? 'custom' : 'maximum';
};

const DaysOptions = ({ value, onChange, onBlur }: DaysOptionsProps) => {
  const [customValue, setCustomValue] = useState('');
  const [customDays, setCustomDays] = useState<number>(0);
  const [customDaysError, setCustomDaysError] = useState('');
  const [selected, setSelected] = useState(getSelectedOption(value));

  useEffect(() => {
    const selectedOption = getSelectedOption(value);
    if (selectedOption === 'custom') setCustomValue(value?.toString());
    setSelected(selectedOption);
  }, [value]);

  const validateCustomDays = (days: number) => {
    if (!days) {
      setCustomDaysError('Required');
    } else if (days < 1 || days >= 365) {
      setCustomDaysError(
        'Custom days must be at least be 1 and not greater than 364'
      );
    } else {
      setCustomDaysError('');
      return true;
    }
    return false;
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value?.trim();
    setCustomValue(value);
  };
  const handleCustomValueChange = () => {
    const days = +customValue;
    if (validateCustomDays(days)) {
      setCustomDays(days);
      onChange(days);
    }
  };

  return (
    <RadioGroup value={selected} onValueChange={setSelected} onBlur={onBlur}>
      <div className="grid grid-cols-3 gap-6">
        <DaysOption
          label="default"
          value={5}
          id="r-1"
          checked={selected === 'default'}
          onChange={onChange}
        >
          <h1 className="text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis">
            5 days
          </h1>
        </DaysOption>
        <DaysOption
          label="custom"
          id="r-2"
          value={customDays}
          checked={selected === 'custom'}
          onChange={handleCustomValueChange}
        >
          <Input
            defaultValue={0}
            type="number"
            min={1}
            max={364}
            disabled={selected !== 'custom'}
            placeholder="0"
            value={customValue}
            onChange={handleCustomInputChange}
            required={selected === 'custom'}
            onBlur={handleCustomValueChange}
          />
          {customDaysError && (
            <span className="text-sm font-medium text-destructive">
              {customDaysError}
            </span>
          )}
          <p className="text-xs text-muted-foreground font-light">
            Min 1 day, Max 364 days
          </p>
        </DaysOption>
        <DaysOption
          label="maximum"
          value={365}
          id="r-3"
          checked={selected === 'maximum'}
          onChange={onChange}
        >
          <h1 className="text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis">
            1 year
          </h1>
        </DaysOption>
      </div>
    </RadioGroup>
  );
};

export default DaysOptions;
