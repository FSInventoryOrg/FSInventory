import { useEffect, useState } from 'react';
import { Tag as TagType } from "../ui/tag-input";
import { useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { TagOption } from '@/types/options';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion } from "framer-motion"
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
import { Defaults } from '@/types/options';

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.04 * index,
    },
  }),
};

interface TagSelectProps {
  onTagSelect: (tag: string[]) => void;
  property?: string;
  option?: string;
  reset?: boolean;
  defaults?: boolean;
}

const TagSelect = ({ onTagSelect, property, option, reset=false, defaults=false }: TagSelectProps) => {
  const [selectedTags, setSelectedTags] = useState<TagType[] | null>(null);

  const { data: optionValues } = useQuery<TagOption[]>({ 
    queryKey: ['fetchOptionValues', property], 
    queryFn: () => imsService.fetchOptionValues(property ?? ''),
    enabled: !!property
  })
  const { data: defaultOptions } = useQuery<Defaults>({ 
    queryKey: ['fetchOptionValues', property], 
    queryFn: () => imsService.fetchOptionValues(property ?? ''),
    enabled: defaults
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
    if (defaults && defaultOptions && defaultOptions.inventoryColumns) {
      const tags = defaultOptions.inventoryColumns.map(property => {
        const matchingProperty = PROPERTIES.find(prop => prop.id === property);
        return matchingProperty ?? { id: property, text: property };
      });
      setSelectedTags(tags);
      const tagIds = tags.map(tag => tag.id);
      onTagSelect(tagIds)
    } else {
      if (!Array.isArray(optionValues)) {
        setSelectedTags(null);
        return;
      }
    
      const tagOption = optionValues.find(value =>
        typeof value === 'object' && 'value' in value && value.value === option
      ) as TagOption | undefined;
    
      if (!tagOption) {
        setSelectedTags(null);
        return;
      }
   
      const tagProperties = tagOption.properties || [];
      const filteredProperties = tagProperties.filter(property =>
        PROPERTIES.some(prop => prop.id === property)
      );
      const tags = filteredProperties.map(property => {
        const matchingProperty = PROPERTIES.find(prop => prop.id === property);
        return matchingProperty ?? { id: property, text: property };
      });
      setSelectedTags(tags);
      const tagIds = tags.map(tag => tag.id);
      onTagSelect(tagIds)

    }
  }, [option, optionValues, defaults, defaultOptions]);  
  

  useEffect(() => {
    if (reset) {
      setSelectedTags(null);
    }
  }, [reset])

  useEffect(() => {
    console.log(selectedTags)
  }, [selectedTags])

  return (
    <section className="z-10 w-full flex flex-col gap-5">
      <div className='flex gap-1 flex-wrap items-center h-fit'>
        <ul className="flex flex-wrap gap-1 items-center h-fit">
          {selectedTags && selectedTags.map((tag, index) => (
            <motion.li
              key={index}
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              custom={index}
            >
              <Tag key={tag.id} text={tag.text} id={tag.id} onRemove={handleRemoveTag} />
            </motion.li>
          ))}
          <motion.li
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            custom={selectedTags ? selectedTags.length : 0}
          >
            <AddTag selectedTags={selectedTags} onAdd={handleAddTag} />
          </motion.li>
        </ul>
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
      <span className='block text-nowrap'>{text}</span>
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
