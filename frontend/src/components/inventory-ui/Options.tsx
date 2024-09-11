import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import {
  FormControl,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from '../ui/scroll-area';
import AddOption from './AddOption';
import EditOption from './EditOption';

interface OptionsProps {
  property: string;
  colorSelect?: boolean
  tagSelect?: boolean
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  placeholder?: string;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function format(str: string): string {
  return str.split(/(?=[A-Z])/).map(part => part.toLowerCase()).join(' ');
}

const Options = ({ property, colorSelect=false, tagSelect=false, field, className }: OptionsProps) => {
  const [open, setOpen] = React.useState(false)
  const [openDeleteOptionDialog, setOpenDeleteOptionDialog] = React.useState(false)
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
      showToast({ message: `New ${property} added successfully!`, type: "SUCCESS" });
      setOpen(false)
      setTimeout(() => {
        setOpen(true);
      }, 100);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });
  const { mutate: updateOptionValue, isPending: isOptionEditPending } = useMutation({
      mutationFn: imsService.updateOptionValue,
      onSuccess: async () => {
      showToast({ message: `${capitalize(format(property))} updated successfully!`, type: "SUCCESS" });
      setOpen(false)
        setTimeout(() => {
          setOpen(true);
        }, 100);
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
    }
    });

  const { mutate: updateAssetsByProperty, isPending: isAssetEditPending } = useMutation({
      mutationFn: imsService.updateAssetsByProperty,
    });

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

  const handleAddOption = (option: OptionType) => {
    addOptionValue({ ...option, type });
  };
  const handleUpdateOption = (updatedOption: OptionType) => {
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
        else if (typeof valueToDelete === 'object' && 'value' in valueToDelete) {
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
    setTimeout(() => {
      setFilteredData([]);
    }, 100);
    setNewOption({ property: property, value: '' });
  };

  React.useEffect(() => {
    if (open) {
      setFilteredData(
        (optionValues ? optionValues : [])
          .filter(option => {
            if (typeof option === 'string') {
            return option.toLowerCase().includes(filterValue.toLowerCase());
            } else if (typeof option === 'object' && option.value) {
              return option.value.toLowerCase().includes(filterValue.toLowerCase());
          }
          return false; // Filter out undefined or other non-matching types
        }) as ColorOption[] // Cast the filtered data to ColorOption[]
      );
      setIsCreating(false)
      setIsEditing(false)
    } else {
      setFilterValue('')
      setTimeout(() => {
        setFilteredData([]);
      }, 100)
      setNewOption({ property: property, value: '' })
    }
  }, [open, filterValue, optionValues, property]);

  const getOptionValue = (option: { value: string }| ColorOption | TagOption| string) => {
    if (typeof option === "string") {
      return option;
    } else if (typeof option === "object" && option.value) {
      return option.value;
    }
    return ''
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true} >
      <PopoverTrigger className={cn(className)} asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? field.value
              : placeholder
              ? capitalize(placeholder)
              : `${capitalize(format(property))} of the asset`}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='-translate-y-2'>
        <div
          className="cursor-pointer absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => {
            setOpen(false)
          }}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        <div id='main panel' className={`flex flex-col gap-2 ${isCreating || isEditing ? 'hidden': ''}`}>
          <h1 className='w-full text-center font-semibold text-sm'>{capitalize(format(property))}</h1>
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
                  setOpen(!open)
                }
              }}
              placeholder="Search..."
            />
          </div>
          <ScrollArea className="h-[225px] justify-center flex align-middle">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((value, index) => {
                const optionValue: string = getOptionValue(value);
                return (
                  <div key={index} className="flex items-center gap-1 my-1.5">
                    <Checkbox
                      className="ml-1"
                      checked={optionValue === field.value}
                      onClick={() =>
                        field.onChange(field.value === optionValue ? "" : optionValue)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          field.onChange(field.value === optionValue ? "" : optionValue);
                        }
                      }}
                    />

                    <Button
                      className={`w-full justify-start focus-visible:ring-0 focus-visible:ring-popover focus-visible:bg-accent h-8 rounded-sm ml-1 ${
                        colorSelect ? "text-white" : ""
                      }`}
                      style={
                        colorSelect
                          ? {
                              backgroundColor: value.color
                                ? value.color
                                : "#8d8d8d",
                            }
                          : undefined
                      }
                      variant={colorSelect ? undefined : "ghost"}
                      value={optionValue} // Conditionally set the value prop
                      type="button"
                      onClick={() => {
                        field.onChange(field.value === optionValue ? "" : optionValue);
                      }}
                      onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setOpen(!open)
                        }
                      }}
                    >
                      <span className="max-w-28 overflow-hidden text-ellipsis">
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
              <div className='flex items-center justify-center gap-1 my-1.5'>No results.</div>
            )}
          </ScrollArea>
          <Button
            className='h-8' 
            variant='secondary' 
            type='button'
            onClick={() => {
              setIsCreating(!isCreating)
              setNewOption({ property: property , value: '' })
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
              isUpdatePending={isOptionEditPending || isAssetEditPending}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default Options;