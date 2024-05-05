import React from "react";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { type Tag as TagType } from "./tag-input";
import { ScrollBar } from "./scroll-area";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"


type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  allowDuplicates: boolean;
  isOpen: boolean;
  children: React.ReactNode;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  autocompleteOptions,
  maxTags,
  onTagAdd,
  isOpen,
  allowDuplicates,
  
  children,
}) => {
  const filteredOptions = autocompleteOptions.filter(
    (option) => !tags.some((tag) => tag.text === option.text)
  );
  return (
    <Command className="border">
      {children}
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
                      if (maxTags && tags.length >= maxTags) return;
                      if (
                        !allowDuplicates &&
                        tags.some((tag) => tag.text === option.text)
                      )
                        return;
                      setTags([...tags, option]);
                      onTagAdd?.(option.text);
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
  );
};
