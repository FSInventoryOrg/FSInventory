import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import {
  FormControl,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from '../ui/scroll-area';
import { ChevronLeftIcon, ChevronsUpDownIcon, PencilIcon, XIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '../Spinner';
import TrashCan from '../graphics/TrashCan'
import ColorSelect from './ColorSelect'

export type ColorOption = {
  value: string;
  color?: string;
}

export type TagOption = {
  value: string;
  properties?: string[];
}

type OptionType = {
  property: string;
  value: string | ColorOption | TagOption;
}

interface OptionsProps {
  property: string;
  colorSelect?: boolean
  tagSelect?: boolean
  className?: string
  type?: 'Hardware' | 'Software'
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function format(str: string): string {
  return str.split(/(?=[A-Z])/).map(part => part.toLowerCase()).join(' ');
}

const EditOptions = ({ property, colorSelect=false, type='Hardware', className }: OptionsProps) => {
  const [open, setOpen] = React.useState(false)
  const { showToast } = useAppContext();
  const [newOption, setNewOption] = React.useState<OptionType>({ property: property, value: '' });
  const [optionToEdit, setOptionToEdit] = React.useState<string>('');
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [prefixCode, setPrefixCode] = React.useState<string>('');

  const { data: optionValues } = useQuery<string[] | ColorOption[] | TagOption[]>({ 
    queryKey: ['fetchOptionValues', property], 
    queryFn: () => imsService.fetchOptionValues(property),
    enabled: open,
  })

  const [filterValue, setFilterValue] = React.useState('');
  const [filteredData, setFilteredData] = React.useState<ColorOption[]>([]);
  
  const handleColorSelect = (color: string) => {
    if (newOption) {
      if (typeof newOption.value === 'string') {
        const newColorOption: ColorOption = {
          value: newOption.value,
          color: color
        };
        setNewOption({ ...newOption, value: newColorOption });
      } else {
        if (color === '') {
          const { value } = newOption.value;
          setNewOption({ ...newOption, value: value });
        } else {
          const updatedColorOption: ColorOption = {
            ...newOption.value,
            color: color
          };
          setNewOption({ ...newOption, value: updatedColorOption });
        }
      }
    }
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

  const DeleteOption = () => {
    const { data: assetCount } = useQuery<number>({ 
      queryKey: ['fetchAssetCount', property, optionToEdit], 
      queryFn: () => imsService.fetchAssetCount(property, optionToEdit),
    })
    
    const { mutate: deleteOption, isPending: isOptionDeletePending } = useMutation({
      mutationFn: () => imsService.deleteOption(property, optionToEdit),
    })

    const handleDelete = async () => {
      await deleteOption();
      setOpen(false)
      setTimeout(() => {
        setOpen(true);
      }, 100);
      showToast({ message: `Option deleted successfully!`, type: "SUCCESS" });
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent className='border-none'>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">
              {
                assetCount ?
                `Unable to delete ${format(property)}` :
                'Are you absolutely sure?'
              }
            </AlertDialogTitle>
            <AlertDialogDescription>
              {
                assetCount ? 
                <>There are {assetCount} assets with {format(property)} of {optionToEdit}. Deleting this {format(property)} is not allowed.</> :
                <>There are no assets with {format(property)} {optionToEdit}. It is safe to delete this {format(property)}.</>
              }
            </AlertDialogDescription>
            <TrashCan />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            { !assetCount && <Button variant='destructive' onClick={handleDelete} disabled={isOptionDeletePending} >Delete {optionToEdit}</Button> }
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

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
      setFilteredData([]);
      setNewOption({ property: property, value: '' })
      setPrefixCode('')
    }
  }, [open, filterValue, optionValues, property]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true} >
      <PopoverTrigger className={cn(className)} asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between text-muted-foreground",
            )}
          >
            Edit {format(property)} options
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className=''>
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
              defaultValue=''
              type='input'
              className='focus-visible:ring-0 focus-visible:ring-popover' 
              onChange={(e) => {
                setFilterValue(e.target.value);
              }} 
              placeholder="Search..."
            />
          </div>
          <ScrollArea className='h-[225px] justify-center flex align-middle'>
            {(filteredData && filteredData.length > 0) ? (
              filteredData.map((value, index) => (
                <div key={index} className='flex items-center gap-1 my-1.5'>
                  <div className={`w-full text-sm justify-start focus-visible:ring-0 focus-visible:ring-popover focus-visible:bg-accent h-8 rounded-sm ml-1`}>
                    <span className='max-w-28 overflow-hidden text-ellipsis'>{typeof value === 'object' ? value.value : value}</span>
                  </div>
                  {colorSelect && 
                    <div 
                      className='h-3 w-3 min-w-3 rounded-full' 
                      style={colorSelect ? { backgroundColor: value.color ? value.color : '#8d8d8d' } : undefined}
                    />
                  }
                  <Button
                    className='mr-3 w-10 h-8'
                    variant='ghost'
                    type='button'
                    size='icon'
                    onClick={() => {
                      setIsEditing(!isEditing)
                      setNewOption({ property: property, value: value})
                      setOptionToEdit(typeof value === 'object' ? value.value : value)
                    }}
                  >
                    <PencilIcon size={16} />
                  </Button>
                </div>
              ))
            ) : (
              <div className='flex text-sm text-muted-foreground items-center justify-center gap-1 my-1.5'>No results.</div>
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
        <div id='create panel' className={`flex flex-col gap-3 ${isCreating ? '': 'hidden'}`}>
          <div className='items-center flex flex-row'>
            <Button 
              type='button'
              size='icon' 
              variant='ghost' 
              className='absolute h-10 w-10'
              onClick={() => {
                setIsCreating(!isCreating)
                setNewOption({ property: property, value: '' })
                setPrefixCode('')
              }}
            >
              <ChevronLeftIcon />
            </Button>
            <h1 className='w-full flex justify-center items-center font-semibold text-sm h-10'>Create {format(property)}</h1>
          </div>
          <Label>{capitalize(property)}</Label>
          <Input 
            value={typeof newOption.value === 'object' ? newOption.value.value : newOption.value}
            type='input'
            className='focus-visible:ring-0 focus-visible:ring-popover' 
            onChange={(e) => {
              const newValue = e.target.value;
              if (typeof newOption === 'object') {
                setNewOption(prevOption => {
                  const updatedValue = typeof prevOption.value === 'object'
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
                setOpen(!open)
              }
            }}
          />
          {property === 'category' ?
            <>
              <Label>Prefix Code</Label>
              <Input
                value={
                  prefixCode
                }
                type="input"
                className="focus-visible:ring-0 focus-visible:ring-popover"
                onChange={(e) => {
                  const newValue = e.target.value;
                  setPrefixCode(newValue.toUpperCase().trim());
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setOpen(!open)
                  }
                }}
              />
            </> : <></>}
          {colorSelect && <ColorSelect onColorSelect={handleColorSelect} reset={isEditing || isCreating} />}
          <Separator className='my-1' />
          <Button 
            className='gap-2'
            disabled={isAddPending}
            type='button'
            onClick={() => {
              if (newOption) {
                if (property === 'category') {
                  addOptionValue({ ...newOption, prefixCode, type })
                }
                else {
                  addOptionValue(newOption)
                }
              }
            }}
          >
            {isAddPending ? <Spinner size={18}/> : null }
            Create
          </Button>
        </div>
        <div id='edit panel' className={`flex flex-col gap-3 ${isEditing ? '': 'hidden'}`}>
          <div className='items-center flex flex-row'>
            <Button 
              type='button'
              size='icon' 
              variant='ghost' 
              className='absolute h-10 w-10'
              onClick={() => {
                setIsEditing(!isEditing)
                setNewOption({ property: property , value: '' })
              }}
            >
              <ChevronLeftIcon />
            </Button>
            <h1 className='w-full flex justify-center items-center font-semibold text-sm h-10'>Edit {format(property)}</h1>
          </div>
          <Label>{capitalize(property)}</Label>
          <Input 
            value={typeof newOption.value === 'object' ? newOption.value.value : newOption.value}            
            type='input'
            className='focus-visible:ring-0 focus-visible:ring-popover' 
            onChange={(e) => {
              setNewOption({ property: property, value: e.target.value});
            }} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); 
                setOpen(!open)
              }
            }}
          />
          {colorSelect && <ColorSelect onColorSelect={handleColorSelect} property={property} option={optionToEdit} />}
          <Separator className='my-1' />
          <div className='flex justify-between'>
            <Button 
              className='gap-2'
              disabled={isOptionEditPending || isAssetEditPending}
              type='button'
              onClick={() => {
                if (newOption && optionValues && optionToEdit) {
                  const indexOfValueToEdit = optionValues.findIndex(option => {
                    if (typeof option === 'string') {
                      return option === optionToEdit;
                    } else if (typeof option === 'object' && option.value) {
                      return option.value === optionToEdit;
                    }
                    return false; // Filter out undefined or other non-matching types
                  });
                  // console.log(indexOfValueToEdit)
                  // console.log(newOption.property)
                  // console.log(newOption.value)
                  updateOptionValue({ property: newOption.property, value: newOption.value, index: indexOfValueToEdit });
                  updateAssetsByProperty({ property: newOption.property, value: optionToEdit, newValue: typeof newOption.value === 'object' ? newOption.value.value : newOption.value });
                }            
              }}
            >
              {(isOptionEditPending || isAssetEditPending) ? <Spinner size={18}/> : null }
              Save
            </Button>
            <DeleteOption />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default EditOptions;