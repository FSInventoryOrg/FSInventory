import { useEffect, useState } from 'react';
import { Tag as TagType } from "../ui/tag-input";
import { useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { TagOption } from './Options';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
  CommandInput,
} from "@/components/ui/command";
import { ScrollBar } from "@/components/ui/scroll-area";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { PlusIcon, XIcon } from 'lucide-react';
import { PROPERTIES } from '@/lib/data';

interface TagSelectProps {
  onTagSelect: (tag: string[]) => void;
  property?: string;
  option?: string;
  reset?: boolean
}

const TagSelect = ({ onTagSelect, property, option, reset }: TagSelectProps) => {
  const [selectedTags, setSelectedTags] = useState<TagType[] | null>(null);

  const { data: optionValues } = useQuery<TagOption[]>({ 
    queryKey: ['fetchOptionValues', property], 
    queryFn: () => imsService.fetchOptionValues(property ?? ''),
    enabled: !!property
  })

  const handleAddTag = (id: string) => {
    setSelectedTags(prevTags => {
      const matchingProperty = PROPERTIES.find(prop => prop.id === id);
      const text = matchingProperty ? matchingProperty.text : id;
      const newTags = [...(prevTags || []), { id, text }];
      const tagIds = newTags.map(tag => tag.id);
  
      onTagSelect(tagIds);
  
      return newTags;
    });
  };
  
  const handleRemoveTag = (id: string) => {
    if (selectedTags) {
      const updatedTags = selectedTags.filter(tag => tag.id !== id);
      setSelectedTags(updatedTags);
      const tagIds = updatedTags.map(tag => tag.id);
      onTagSelect(tagIds);
    }
  };
  
  useEffect(() => {
    if (Array.isArray(optionValues)) {
      const tagOption = optionValues.find(value =>
        typeof value === 'object' && 'value' in value && value.value === option
      ) as TagOption | undefined;
  
      if (tagOption) {
        const tagProperties = tagOption.properties || [];
        const tags: TagType[] = tagProperties
          .filter(property => PROPERTIES.some(prop => prop.id === property))
          .map(property => {
            const matchingProperty = PROPERTIES.find(prop => prop.id === property);
            return matchingProperty ?? { id: property, text: property };
          });
        setSelectedTags(tags);
      }
    } else {
      setSelectedTags(null);
    }
  }, [option, optionValues])

  useEffect(() => {
    setSelectedTags(null);
  }, [reset])

  return (
    <section className="z-10 w-full flex flex-col gap-5">
      <div className="w-full">
        {selectedTags && (
          <div className='space-x-1 space-y-1'>
            {selectedTags.map(tag => (
              <Tag key={tag.id} text={tag.text} id={tag.id} onRemove={handleRemoveTag} />
            ))}
            <AddTag selectedTags={selectedTags} onAdd={handleAddTag} />
          </div>
        )}
        {selectedTags === null && <AddTag onAdd={handleAddTag} />}
      </div>
    </section>
  );
}

interface TagProps {
  text: string;
  id: string;
  onRemove: (id: string) => void;
}

const Tag = ({ text, id, onRemove }: TagProps) => {
  const handleRemoveClick = () => {
    onRemove(id);
  };

  return (
    <Badge 
      className="rounded font-light animate-fadeIn text-secondary-foreground inline-flex items-center text-xs transition-all gap-1 px-2 border border-border h-6" 
      variant='secondary'
    >
      {text}
      <Button 
        className='h-4 w-4 rounded hover:bg-transparent text-accent-foreground' 
        variant='ghost' 
        size='icon' 
        type='button' 
        onClick={handleRemoveClick}
      >
        <XIcon size={12} />
      </Button>
    </Badge>
  );
};

interface AddTagProps {
  selectedTags?: TagType[] | null;
  onAdd: (id: string) => void;
}

const AddTag: React.FC<AddTagProps> = ({ selectedTags, onAdd }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleKeyDown = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleFocus = () => {
    setIsOpen(true)
  }
  const handleBlur = () => {
    setIsOpen(false)
  }

  const filteredOptions = PROPERTIES.filter(option => {
    return !selectedTags || !selectedTags.find(tag => tag.id === option.id);
  });

  const handleTagClick = (id: string) => {
    onAdd(id)
  };


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="secondary" 
          size="icon" 
          type="button" 
          className='h-6 w-6 rounded border border-border'
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          <PlusIcon size={12} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-0">
        <Command className="border">
          <CommandInput
            placeholder='Search properties...'
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full"
          />
          {isOpen && 
            (
              <CommandList className="animate-in fade-in-0 zoom-in-95">
              <CommandEmpty>No results found.</CommandEmpty>
              <ScrollAreaPrimitive.Root className="relative overflow-hidden">
                <ScrollAreaPrimitive.Viewport className="h-fit max-h-[200px]  w-full rounded-[inherit]">
                  <CommandGroup heading="Properties" className="text-start">
                    {filteredOptions.map((option) => (
                      <CommandItem 
                        key={option.id}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          handleTagClick(option.id)
                        }}
                      >
                        {option.text}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollAreaPrimitive.Viewport>
                <ScrollBar />
                <ScrollAreaPrimitive.Corner />
              </ScrollAreaPrimitive.Root>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TagSelect;
