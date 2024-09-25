import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '../Spinner';
import TagSelect from './TagSelect';
import ColorSelect from './ColorSelect';
import { OptionType } from '@/types/options';
import useOption from './useOptions';

interface AddOptionProps {
  defaultOption: OptionType;
  property: string;
  colorSelect?: boolean;
  tagSelect?: boolean;
  className?: string;
  onCancel: () => void;
  onSave: (option: OptionType) => void;
  isCreating: boolean;
  isAddPending: boolean;
  onEnterPressed?: () => void;
}

const AddOption = ({
  defaultOption,
  property,
  tagSelect,
  colorSelect,
  onCancel,
  onSave,
  isCreating,
  isAddPending,
  onEnterPressed,
}: AddOptionProps) => {
  const {
    newOption,
    setNewOption,
    handleColorSelect,
    handleTagSelect,
    getOptionValue,
  } = useOption(defaultOption);

  const handleCancel = () => {
    onCancel();
    setNewOption({ property, value: '' });
  };

  const handleAddOption = () => {
    onSave(newOption);
  };

  return (
    <>
      <div className='items-center flex flex-row'>
        <Button
          type='button'
          size='icon'
          variant='ghost'
          className='absolute h-10 w-10'
          onClick={handleCancel}
        >
          <ChevronLeftIcon />
        </Button>
        <h1 className='w-full flex justify-center items-center font-semibold text-sm h-10'>
          Create {format(property)}
        </h1>
      </div>
      <Label>Value</Label>
      <Input
        value={getOptionValue(newOption.value)}
        type='input'
        className='focus-visible:ring-0 focus-visible:ring-popover'
        onChange={(e) => {
          const newValue = e.target.value;
          if (typeof newOption === 'object') {
            setNewOption((prevOption) => {
              const updatedValue =
                typeof prevOption.value === 'object'
                  ? { ...prevOption.value, value: newValue }
                  : newValue;
              return { ...prevOption, value: updatedValue };
            });
          } else {
            setNewOption({ property: property, value: newValue });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnterPressed?.();
          }
        }}
      />
      {colorSelect && (
        <ColorSelect onColorSelect={handleColorSelect} reset={isCreating} />
      )}
      {tagSelect && (
        <TagSelect onTagSelect={handleTagSelect} reset={isCreating} />
      )}
      <Separator className='my-1' />
      <Button
        className='gap-2'
        disabled={isAddPending}
        type='button'
        onClick={() => {
          if (newOption) handleAddOption();
        }}
      >
        {isAddPending ? <Spinner size={18} /> : null}
        Create
      </Button>
    </>
  );
};

export default AddOption;
