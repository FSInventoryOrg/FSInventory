import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as imsService from '@/ims-service';
import { useAppContext } from '@/hooks/useAppContext';
import { FormControl } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronsUpDownIcon, PencilIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ColorOption, OptionType, TagOption } from '@/types/options';
import { AssetCounterType } from '@/types/asset';
import AddOption from './AddOption';
import EditOption from './EditOption';


interface OptionsProps {
  property: string;
  colorSelect?: boolean;
  tagSelect?: boolean;
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  className?: string;
  placeholder?: string;
  type?: 'Hardware' | 'Software';
}

function isTypedOption(
  object: ColorOption | TagOption | string
): object is TagOption {
  if (typeof object === 'string') return false;
  return 'type' in object;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function format(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((part) => part.toLowerCase())
    .join(' ');
}

const Options = ({
  property,
  colorSelect = false,
  tagSelect = false,
  field,
  className,
  placeholder,
  type,
}: OptionsProps) => {
  const [open, setOpen] = React.useState(false);
  const { showToast } = useAppContext();
  const [newOption, setNewOption] = React.useState<OptionType>({
    property: property,
    value: '',
  });
  const [optionToEdit, setOptionToEdit] = React.useState<string>('');
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const { data: optionValues } = useQuery<
    string[] | ColorOption[] | TagOption[]
  >({
    queryKey: ['fetchOptionValues', property],
    queryFn: () => imsService.fetchOptionValues(property),
    enabled: open,
  });

  const [filterValue, setFilterValue] = React.useState('');
  const [filteredData, setFilteredData] = React.useState<ColorOption[]>([]);

  const getOptionValue = (option: ColorOption | TagOption | string) => {
    if (typeof option === 'string') {
      return option;
    } else if (typeof option === 'object' && option.value) {
      return option.value;
    }
    return '';
  };

  const { mutate: addOptionValue, isPending: isAddPending } = useMutation({
    mutationFn: imsService.addOptionValue,
    onSuccess: async () => {
      showToast({
        message: `New ${property} added successfully!`,
        type: 'SUCCESS',
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });
  const { mutate: updateOptionValue, isPending: isOptionEditPending } =
    useMutation({
      mutationFn: imsService.updateOptionValue,
      onSuccess: async () => {
        showToast({
          message: `${capitalize(format(property))} updated successfully!`,
          type: 'SUCCESS',
        });
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: 'ERROR' });
      },
    });

  const { mutate: updateAssetsByProperty, isPending: isAssetEditPending } =
    useMutation({
      mutationFn: imsService.updateAssetsByProperty,
    });
  const { mutate: updateAssetPrefixCodes, isPending: isAssetPrefixEditPending } = useMutation({
      mutationFn: imsService.updateAssetsByProperty,
    });
  const { mutate: updateAssetCounter, isPending: isUpdateAssetCounterPending } = useMutation({
    mutationFn: imsService.updateAssetCounter
  })

  const findIndexInOptions = (optionVal: string) => {
    if (!optionValues) return -1;
    return optionValues.findIndex((option) => {
      if (typeof option === 'string') {
        return option === optionVal;
      } else if (typeof option === 'object' && option.value) {
        return option.value === optionVal;
      }
      return false; // Filter out undefined or other non-matching types
    });
  };

  const handleAddOption = (option: OptionType, prefixCode?: string) => {
    addOptionValue({ ...option, prefixCode, type });
  };
  const handleUpdateOption = (updatedOption: OptionType, updatedAssetCounter?: AssetCounterType & { oldPrefixCode: string}) => {
    const indexOfValueToEdit = findIndexInOptions(optionToEdit);
    updateOptionValue({
      property: updatedOption.property,
      value: updatedOption.value,
      index: indexOfValueToEdit,
    });
    updateAssetsByProperty({
      property: updatedOption.property,
      value: optionToEdit,
      newValue:
        typeof updatedOption.value === 'object'
          ? updatedOption.value.value
          : updatedOption.value,
    });
    if (!!updatedAssetCounter) {
      const { oldPrefixCode: prefixCode, ...rest } = updatedAssetCounter
      updateAssetCounter({
        prefixCode,
        updatedAssetCounter: rest
      });
      updateAssetsByProperty({
      property: 'code',
      value: prefixCode,
      newValue: rest.prefixCode
    });
    }
    if (indexOfValueToEdit === findIndexInOptions(field.value)) {
      field.onChange(
        typeof updatedOption.value === 'object'
          ? updatedOption.value.value
          : updatedOption.value
      );
    }
  };

  const handleDeleteOption = (optionToDelete: string) => {
    if (optionValues) {
      const indexOfValueToDelete = findIndexInOptions(optionToDelete);

      if (indexOfValueToDelete !== -1) {
        const valueToDelete = optionValues[indexOfValueToDelete];

        // Check if optionValues[indexOfValueToDelete] is a string
        if (typeof valueToDelete === 'string') {
          if (valueToDelete === field.value) {
            field.onChange('');
          }
        }
        // Check if optionValues[indexOfValueToDelete] is an object with a 'value' property
        else if (
          typeof valueToDelete === 'object' &&
          'value' in valueToDelete
        ) {
          if (valueToDelete.value === field.value) {
            field.onChange('');
          }
        }
      }
    }
    setOpen(false);
    setTimeout(() => {
      setOpen(true);
    }, 100);
    showToast({ message: `Option deleted successfully!`, type: 'SUCCESS' });
  };

  const reset = () => {
    setFilterValue('');
    setFilteredData([]);
    setNewOption({ property: property, value: '' });
  };
  
  React.useEffect(() => {
    if (open) {
      setFilteredData(
        (optionValues ? optionValues : []).filter((option) => {
          const optionVal = getOptionValue(option).toLowerCase();
          const optionMatchesType =
            isTypedOption(option) && option.type === type;

          return (
            optionVal.includes(filterValue.toLowerCase()) &&
            (type ? optionMatchesType : true)
          );
        }) as ColorOption[]
      );
      setIsCreating(false);
      setIsEditing(false);
    } else {
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filterValue, optionValues, property, type]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger className={cn(className)} asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn(
              'justify-between',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value
              ? field.value
              : placeholder
              ? capitalize(placeholder)
              : `${capitalize(format(property))} of the asset`}
            <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='-translate-y-2'>
        <div
          className='cursor-pointer absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
          onClick={() => {
            setOpen(false);
          }}
        >
          <XIcon className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </div>
        <div
          id='main panel'
          className={`flex flex-col gap-2 ${
            isCreating || isEditing ? 'hidden' : ''
          }`}
        >
          <h1 className='w-full text-center font-semibold text-sm'>
            {capitalize(format(property))}
          </h1>
          <div className='flex items-center'>
            <Input
              value={field.value}
              type='input'
              className='focus-visible:ring-0 focus-visible:ring-popover'
              onChange={(e) => {
                setFilterValue(e.target.value);
                field.onChange(e.target.value); // Set the value of the field
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setOpen(!open);
                }
              }}
              placeholder='Search...'
            />
          </div>
          <ScrollArea className='h-[225px] justify-center flex align-middle'>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((value, index) => {
                const optionValue: string = getOptionValue(value);
                return (
                  <div key={index} className='flex items-center gap-1 my-1.5'>
                    <Checkbox
                      className='ml-1'
                      checked={optionValue === field.value}
                      onClick={() =>
                        field.onChange(
                          field.value === optionValue ? '' : optionValue
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          field.onChange(
                            field.value === optionValue ? '' : optionValue
                          );
                        }
                      }}
                    />

                    <Button
                      className={`w-full justify-start focus-visible:ring-0 focus-visible:ring-popover focus-visible:bg-accent h-8 rounded-sm ml-1 ${
                        colorSelect ? 'text-white' : ''
                      }`}
                      style={
                        colorSelect
                          ? { backgroundColor: value.color ?? '#8d8d8d' }
                          : undefined
                      }
                      variant={colorSelect ? undefined : 'ghost'}
                      value={optionValue} // Conditionally set the value prop
                      type='button'
                      onClick={() => {
                        field.onChange(
                          field.value === optionValue ? '' : optionValue
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setOpen(!open);
                        }
                      }}
                    >
                      <span className='max-w-28 overflow-hidden text-ellipsis'>
                        {optionValue}
                      </span>
                    </Button>
                    <Button
                      className='mr-3 w-12 h-8'
                      variant='ghost'
                      type='button'
                      size='icon'
                      onClick={() => {
                        setIsEditing(!isEditing);
                        setNewOption({ property: property, value: value });
                        setOptionToEdit(optionValue);
                      }}
                    >
                      <PencilIcon size={16} />
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className='flex items-center justify-center gap-1 my-1.5'>
                No results.
              </div>
            )}
          </ScrollArea>
          <Button
            className='h-8'
            variant='secondary'
            type='button'
            onClick={() => {
              setIsCreating(!isCreating);
              setNewOption({ property: property, value: '' });
            }}
          >
            Create a new {format(property)}
          </Button>
        </div>
        {isCreating && (
          <div
            id='create panel'
            className={`flex flex-col gap-3 ${isCreating ? '' : 'hidden'}`}
          >
            <AddOption
              defaultOption={newOption}
              property={property}
              colorSelect={colorSelect}
              tagSelect={tagSelect}
              onEnterPressed={() => setOpen(!open)}
              onCancel={() => setIsCreating((prev) => !prev)}
              onSave={handleAddOption}
              isCreating={isCreating}
              isAddPending={isAddPending}
            />
          </div>
        )}

        {isEditing && (
          <div
            id='edit panel'
            className={`flex flex-col gap-3 ${isEditing ? '' : 'hidden'}`}
          >
            <EditOption
              option={newOption}
              property={property}
              colorSelect={colorSelect}
              tagSelect={tagSelect}
              onEnterPressed={() => setOpen(!open)}
              onCancel={() => setIsEditing((prev) => !prev)}
              onDelete={handleDeleteOption}
              onUpdate={handleUpdateOption}
              isUpdatePending={isOptionEditPending || isAssetEditPending || isUpdateAssetCounterPending || isAssetPrefixEditPending}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Options;
