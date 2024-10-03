import { ColorOption, OptionType, TagOption } from '@/types/options';
import { useState } from 'react';

const useOption = (option: OptionType) => {
  const [newOption, setNewOption] = useState<OptionType>({ ...option });

  const getOptionValue = (option: ColorOption | TagOption | string) => {
    if (typeof option === 'string') {
      return option;
    } else if (typeof option === 'object' && option.value) {
      return option.value;
    }
    return '';
  };

  const handleTagSelect = (tags: string[]) => {
    if (newOption) {
      if (typeof newOption.value === 'string') {
        const newTagOption: TagOption = {
          value: newOption.value,
          properties: tags,
        };
        setNewOption({ ...newOption, value: newTagOption });
      } else if (
        typeof newOption.value === 'object' &&
        'value' in newOption.value
      ) {
        const newValue = { ...newOption.value, properties: tags };
        setNewOption({ ...newOption, value: newValue });
      }
    }
  };

  const handleColorSelect = (color: string) => {
    if (newOption) {
      if (typeof newOption.value === 'string') {
        const newColorOption: ColorOption = {
          value: newOption.value,
          color: color,
        };
        setNewOption({ ...newOption, value: newColorOption });
      } else {
        if (color === '') {
          const { value } = newOption.value;
          setNewOption({ ...newOption, value: value });
        } else {
          const updatedColorOption: ColorOption = {
            ...newOption.value,
            color: color,
          };
          setNewOption({ ...newOption, value: updatedColorOption });
        }
      }
    }
  };
  return {
    getOptionValue,
    newOption,
    setNewOption,
    handleColorSelect,
    handleTagSelect,
  };
};

export default useOption;
