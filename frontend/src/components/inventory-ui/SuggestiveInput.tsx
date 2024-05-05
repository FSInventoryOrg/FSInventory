import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, InputProps } from '../ui/input';
import { useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { Button } from "@/components/ui/button"

interface SuggestiveInputProps extends InputProps {
  property: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: any;
}

const SuggestiveInput = React.forwardRef<HTMLInputElement, SuggestiveInputProps>(
  ({ property, placeholder, field, className, autoComplete, type }, ref) => {
    const { data: options } = useQuery<string[]>({ 
      queryKey: ['fetch', property], 
      queryFn: () => imsService.fetchAssetUniqueValuesByProperty(property),
    });

    const [filteredOptions, setFilteredOptions] = React.useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false); // State to control visibility of suggestions
    const [selectedIndex, setSelectedIndex] = React.useState<number>(-1); // State to store the index of the currently selected suggestion

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const filtered = options?.filter(option =>
        option.toLowerCase().includes(event.target.value.toLowerCase()) && option.trim() !== ''
      ) || [];
      setFilteredOptions(filtered);
      setShowSuggestions(filtered.length > 0); // Show suggestions only if there are filtered options
      setSelectedIndex(-1); // Reset selected index when input changes
      field.onChange(event.target.value); // Update form value
    };

    const handleSuggestionClick = (option: string) => {
      setFilteredOptions([]);
      setShowSuggestions(false); // Hide suggestions when clicked
      setSelectedIndex(-1); // Reset selected index when suggestion is clicked
      field.onChange(option);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          field.onChange(filteredOptions[selectedIndex]);
          setFilteredOptions([]);
          setShowSuggestions(false); // Hide suggestions when Enter is pressed
          setSelectedIndex(-1); // Reset selected index
        } else if (filteredOptions.length > 0) {
          field.onChange(filteredOptions[0]);
          setFilteredOptions([]);
          setShowSuggestions(false); // Hide suggestions when Enter is pressed
          setSelectedIndex(-1); // Reset selected index
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredOptions.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length);
      } else if (event.key === 'Tab' && showSuggestions) {
        event.preventDefault(); 
        if (!event.shiftKey) {
          setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredOptions.length);
        } else {
          setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length);
        }
      } else if (event.key === 'Escape' && showSuggestions) {
        event.preventDefault();
        setShowSuggestions(false);
      }
    };

    React.useEffect(() => {
      if (showSuggestions && selectedIndex !== -1) {
        const suggestionElement = document.getElementById(`suggestion_${selectedIndex}`);
        if (suggestionElement) {
          suggestionElement.scrollIntoView({ behavior: "auto", block: "nearest" });
        }
      }
    }, [showSuggestions, selectedIndex]);

    const handleInputBlur = () => {
      setTimeout(() => {
        setShowSuggestions(false); // Hide suggestions after a short delay
      }, 100); // Adjust the delay time as needed
    };

    return (
      <div className='relative w-full'>
        <Input
          ref={ref}
          type={type}
          autoComplete={autoComplete}
          className={cn(className)}
          placeholder={placeholder}
          onChangeCapture={handleInputChange}
          onKeyDown={handleKeyPress}
          onBlurCapture={(handleInputBlur)}
          {...field}
        />
        {showSuggestions && filteredOptions.length > 0 && ( // Show suggestions only when showSuggestions is true, searchTerm is not empty, and there are filtered options
          <div className='max-h-[200px] overflow-y-scroll absolute top-full left-0 bg-popover border border-border w-full z-50 rounded-lg my-1 p-1'>
            {filteredOptions.map((option, index) => (
              <Button 
                key={index} 
                id={`suggestion_${index}`}
                type='button'
                variant='ghost'
                className={cn('px-4 py-2 w-full justify-start', {
                  'bg-accent': index === selectedIndex, // Apply background color to the selected suggestion
                })}
                onClick={() => handleSuggestionClick(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }
)
export default SuggestiveInput;
