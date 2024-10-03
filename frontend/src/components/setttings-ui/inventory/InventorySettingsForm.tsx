import React from "react"
import { InventorySettingsSchema } from "@/schemas/InventorySettingsSchema"
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Spinner } from "@/components/Spinner"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import DefaultOptionsForm from "@/components/inventory-ui/DefaultOptionsForm"
import { Defaults } from "@/types/options"
import VisibleColumnsForm from "../../inventory-ui/VisibleColumnsForms"
import SelectOptionsForm from "../../inventory-ui/SelectOptionsForm"

const InventorySettingsForm = ({ defaults }: { defaults: Defaults }) => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['']);

  const form = useForm<z.infer<typeof InventorySettingsSchema>>({
    resolver: zodResolver(InventorySettingsSchema),
    defaultValues: {
      status: defaults.status,
      softwareCategory: defaults.softwareCategory,
      hardwareCategory: defaults.hardwareCategory,
      equipmentType: defaults.equipmentType,
      deployableStatus: defaults.deployableStatus ?? 'Deployed',
      retrievableStatus: defaults.retrievableStatus ?? ['IT Storage'],
      inventoryColumns: defaults.inventoryColumns,
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.updateOptionDefaults,
    onSuccess: async () => {
      showToast({ message: "Inventory settings and preferences saved!", type: "SUCCESS" });
      queryClient.invalidateQueries({queryKey: ['fetchOptionValues', 'defaults']})
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  const onSubmit = (data: z.infer<typeof InventorySettingsSchema>) => {
    const settingsData: any = { 
      ...data,
      inventoryColumns: selectedTags,
    };
  
    Object.keys(settingsData).forEach((key) => {
      if (settingsData[key] === '-') {
        settingsData[key] = '';
      }
    });
  
    mutate(settingsData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col">
        <DefaultOptionsForm />
        <VisibleColumnsForm onTagSelect={setSelectedTags} />
        <SelectOptionsForm />
        <Button type="submit" disabled={isPending} className="gap-2 w-fit md:w-1/6 self-end">
          {isPending ? <Spinner size={18}/> : null }
          Save changes
        </Button>
      </form>
    </Form>
  )
}

export default InventorySettingsForm;