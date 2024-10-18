import { useState, useEffect } from 'react';
import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { capitalize, format } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '../Spinner';
import ColorSelect from './ColorSelect';
import DeletePropertyDialog from './DeletePropertyDialog';
import { OptionType } from '@/types/options';
import useOption from './useOptions';
import useAssetCounter from './useAssetCounter';
import { AssetCounterType } from '@/types/asset';

interface EditOptionProps {
  option: OptionType;
  property: string;
  colorSelect?: boolean;
  tagSelect?: boolean;
  className?: string;
  onCancel: () => void;
  onDelete: (optionToDelete: string) => void;
  onUpdate: (updatedOption: OptionType, updatedAssetCounter?: AssetCounterType & { oldPrefixCode: string}) => void;
  isUpdatePending: boolean;
  onEnterPressed?: () => void;
}

const EditOption = ({
  option,
  property,
  colorSelect,
  onCancel,
  onDelete,
  onUpdate,
  isUpdatePending,
  onEnterPressed,
}: EditOptionProps) => {
  const [openDeleteOptionDialog, setOpenDeleteOptionDialog] = useState(false);
  const isObject: boolean = typeof option.value === 'object';
  const propertyIsCategory: boolean = property === 'category';
  const [newPrefixCode, setNewPrefixCode] = propertyIsCategory ? useState('') : [undefined, () => { }];

  const {
    newOption: editedOption,
    setNewOption: setEditedOption,
    handleColorSelect,
    getOptionValue,
  } = useOption(option);

  const {
    getAssetCounterFromCategory,
    updateAssetCounterInCache
  } = useAssetCounter(propertyIsCategory, option)
  const assetCounter = getAssetCounterFromCategory() ?? undefined;
  const { prefixCode: oldPrefixCode } = assetCounter ?? { prefixCode: '' };

  const handleCancel = () => {
    onCancel();
    setEditedOption({ property, value: '' });
  };

  const handleUpdate = () => {
    const isPrefixCodeChanged: boolean = !!newPrefixCode && oldPrefixCode !== newPrefixCode;
    const category: string = typeof editedOption.value === 'object' ? editedOption.value.value : '';
    isPrefixCodeChanged && !!assetCounter && !!newPrefixCode ?
      (() => {
        onUpdate(editedOption, { ...assetCounter, category, prefixCode: newPrefixCode, oldPrefixCode })
        updateAssetCounterInCache(assetCounter._id!, { prefixCode: newPrefixCode, category })
      })() :
      (() => {
        onUpdate(editedOption)
      })();
  };

  const optionToEdit = getOptionValue(editedOption.value);

  useEffect(() => {
    if (propertyIsCategory && newPrefixCode === '') {
      setNewPrefixCode(oldPrefixCode);
    }
  }, [propertyIsCategory, assetCounter])

  return (
    <>
      <div className='items-center flex flex-row'>
        {/* Back button  */}
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
          Edit {format(property)}
        </h1>
      </div>
      <Label>{capitalize(property)}</Label>
      <Input
        value={getOptionValue(editedOption.value) as string}
        type='input'
        className='focus-visible:ring-0 focus-visible:ring-popover'
        onChange={(e) => {
          setEditedOption({ property: property, value: isObject ? {...(option.value as object), value: e.target.value} : e.target.value });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnterPressed?.();
          }
        }}
      />
      {propertyIsCategory && newPrefixCode !== null && (
        <>
          <Label>Prefix Code</Label>
          <Input
            value={newPrefixCode}
            type='input'
            className='focus-visible:ring-0 focus-visible:ring-popover'
            onChange={(e) => {
              const newValue = e.target.value;
              setNewPrefixCode(newValue.toUpperCase().trim());
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onEnterPressed?.();
              }
            }}
          />
        </>
      )}
      {colorSelect && (
        <ColorSelect
          onColorSelect={handleColorSelect}
          property={property}
          option={optionToEdit as string}
        />
      )}
      <Separator className='my-1' />
      <div className='flex justify-between'>
        <Button
          className='gap-2'
          disabled={isUpdatePending}
          type='button'
          onClick={handleUpdate}
        >
          {isUpdatePending ? <Spinner size={18} /> : null}
          Save
        </Button>
        <Button
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md 
    text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
    disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2'
          onClick={(event) => {
            event.preventDefault();
            setOpenDeleteOptionDialog(true);
          }}
        >
          Delete
        </Button>
        <DeletePropertyDialog
          open={openDeleteOptionDialog}
          setOpen={setOpenDeleteOptionDialog}
          property={property}
          value={optionToEdit as string}
          onDelete={() => onDelete(optionToEdit as string)}
        />
      </div>
    </>
  );
};

export default EditOption;
