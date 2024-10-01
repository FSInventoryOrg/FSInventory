import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { ColorOption } from '@/types/options';
import { Color, COLORS } from '@/lib/data';

interface ColorSelectProps {
  onColorSelect: (color: string) => void; 
  property?: string;
  option?: string;
  reset?: boolean;
}

const ColorSelect = ({ onColorSelect, property, option, reset }: ColorSelectProps) => {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const { data: optionValues } = useQuery<ColorOption[]>({ 
    queryKey: ['fetchOptionValues', property], 
    queryFn: () => imsService.fetchOptionValues(property ?? ''),
    enabled: !!property
  })

  const handleClick = (color: Color) => {
    if (selectedColor && selectedColor.id === color.id) {
      // If the same color is clicked again, deselect it
      setSelectedColor(null);
      onColorSelect('');
    } else {
      setSelectedColor(color);
      onColorSelect(color.color);
    }
  };

  useEffect(() => {
    if (Array.isArray(optionValues)) {
      const colorOption = optionValues.find(value =>
        typeof value === 'object' && 'value' in value && value.value === option
      ) as ColorOption | undefined;
  
      if (colorOption) {
        const { color } = colorOption;
        if (color && color !== '') {
          const colorObject = COLORS.find(c => c.color === color);
          if (colorObject) {
            setSelectedColor(colorObject)
          }
        }
      }
    } else {
      setSelectedColor(null);
    }
  }, [option, optionValues])

  useEffect(() => {
    setSelectedColor(null);
  }, [reset])

  return (
    <div>
      <div className="grid grid-cols-4 gap-1">
        {COLORS.map((color) => (
          <Button
            key={color.id}
            type='button'
            className='h-10 text-foreground'
            style={{ 
              backgroundColor: color.color,
              border: selectedColor?.id === color.id ? '2px solid' : 'none'
            }}
            onClick={() => handleClick(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelect;