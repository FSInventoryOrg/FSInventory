import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ColorOption, TagOption } from '@/types/options';
import * as imsService from '@/ims-service';
import { useQuery } from '@tanstack/react-query';
import { InventorySettingsFormData } from '@/schemas/InventorySettingsSchema';
import StatusMultiSelect from './StatusMultiSelect';

const DefaultOptionsForm = () => {
  const { control } = useFormContext<InventorySettingsFormData>();

  const { data: statusData, isLoading: isStatusDataLoading } = useQuery<
    ColorOption[]
  >({
    queryKey: ['fetchOptionValues', 'status'],
    queryFn: () => imsService.fetchOptionValues('status'),
  });

  const { data: categoryData, isLoading: isCategoryDataLoading } = useQuery<
    TagOption[]
  >({
    queryKey: ['fetchOptionValues', 'category'],
    queryFn: () => imsService.fetchOptionValues('category'),
  });

  const { data: equipmentTypeData, isLoading: isEquipmentTypeDataLoading } =
    useQuery<string[]>({
      queryKey: ['fetchOptionValues', 'equipmentType'],
      queryFn: () => imsService.fetchOptionValues('equipmentType'),
    });

  const isFormDataLoading =
    isStatusDataLoading || isCategoryDataLoading || isEquipmentTypeDataLoading;

  return (
    <div className="w-full flex flex-col">
      <div className="pb-2">
        <h1 className="text-xl font-semibold">Default values</h1>
        <h3 className="text-accent-foreground">
          Select default values for asset properties.
        </h3>
      </div>
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem className="pb-2">
            <FormLabel className="font-medium">Status</FormLabel>
            <div className="flex md:w-2/3 gap-1">
              {!isFormDataLoading ? (
                <Select
                  disabled={isStatusDataLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={'-'}
                      className="w-full text-accent-foreground"
                    >
                      -
                    </SelectItem>
                    {statusData &&
                      statusData.map((status: ColorOption) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                          className="w-full"
                        >
                          {status.value}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 w-full border rounded-md" />
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hardwareCategory"
        render={({ field }) => (
          <FormItem className="pb-2">
            <FormLabel className="font-medium">Hardware Category</FormLabel>
            <div className="flex md:w-2/3 gap-1">
              {!isFormDataLoading ? (
                <Select
                  disabled={isCategoryDataLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default hardware category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={'-'}
                      className="w-full text-accent-foreground"
                    >
                      -
                    </SelectItem>
                    {categoryData &&
                      categoryData
                        .filter((category) => category.type === 'Hardware')
                        .map((category: TagOption) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                            className="w-full"
                          >
                            {category.value}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 w-full border rounded-md" />
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="softwareCategory"
        render={({ field }) => (
          <FormItem className="pb-2">
            <FormLabel className="font-medium">Software Category</FormLabel>
            <div className="flex md:w-2/3 gap-1">
              {!isFormDataLoading ? (
                <Select
                  disabled={isCategoryDataLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default software category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={'-'}
                      className="w-full text-accent-foreground"
                    >
                      -
                    </SelectItem>
                    {categoryData &&
                      categoryData
                        .filter((category) => category.type === 'Software')
                        .map((category: TagOption) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                            className="w-full"
                          >
                            {category.value}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 w-full border rounded-md" />
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="equipmentType"
        render={({ field }) => (
          <FormItem className="pb-2">
            <FormLabel className="font-medium">Equipment type</FormLabel>
            <div className="flex md:w-2/3 gap-1">
              {!isFormDataLoading ? (
                <Select
                  disabled={isEquipmentTypeDataLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default equipment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={'-'}
                      className="w-full text-accent-foreground"
                    >
                      -
                    </SelectItem>
                    {equipmentTypeData &&
                      equipmentTypeData.map((equipmentType: string) => (
                        <SelectItem
                          key={equipmentType}
                          value={equipmentType}
                          className="w-full"
                        >
                          {equipmentType}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 w-full border rounded-md" />
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="deployableStatus"
        render={({ field }) => (
          <FormItem className="pb-2">
            <FormLabel className="font-medium">
              Statuses for deployable assets
            </FormLabel>
            <FormControl>
              <div className="flex md:w-2/3 gap-1">
                {statusData && (
                  <StatusMultiSelect
                    type="deployable"
                    options={statusData.filter(
                      (option) => option.value !== 'Deployed'
                    )}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select statuses..."
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
            <FormDescription>
              These statuses signify assets that can be deployed.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="retrievableStatus"
        render={({ field }) => (
          <FormItem className="pb-2">
            <FormLabel className="font-medium">
              Status for recoverable assets
            </FormLabel>
            <div className="flex md:w-2/3 gap-1">
              {!(
                isStatusDataLoading ||
                isCategoryDataLoading ||
                isEquipmentTypeDataLoading
              ) ? (
                <Select
                  disabled
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status for recoverable assets" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={'-'}
                      className="w-full text-accent-foreground"
                    >
                      -
                    </SelectItem>
                    {statusData &&
                      statusData.map((status: ColorOption) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                          className="w-full"
                        >
                          {status.value}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-10 w-full border rounded-md" />
              )}
            </div>
            <FormDescription>
              This status signifies assets that are deployed and can be
              recovered.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator className="my-4" />
    </div>
  );
};

export default DefaultOptionsForm;
