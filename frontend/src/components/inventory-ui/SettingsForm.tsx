import React from "react"
import { InventorySettingsSchema } from "@/schemas/InventorySettingsSchema"
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Spinner } from "@/components/Spinner"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import DefaultOptionsForm from "@/components/inventory-ui/DefaultOptionsForm"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon } from "lucide-react"
import { Defaults } from "@/types/options"
import VisibleColumnsForm from "./VisibleColumnsForms"
import SelectOptionsForm from "./SelectOptionsForm"
import { useNavigate } from "react-router-dom"

const SettingsForm = ({ defaults }: { defaults: Defaults }) => {
  const navigate = useNavigate()
  const { showToast } = useAppContext();
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['']);

  const form = useForm<z.infer<typeof InventorySettingsSchema>>({
    resolver: zodResolver(InventorySettingsSchema),
    defaultValues: {
      status: defaults.status,
      category: defaults.category,
      equipmentType: defaults.equipmentType,
      deployableStatus: defaults.deployableStatus,
      retrievableStatus: defaults.retrievableStatus,
      inventoryColumns: defaults.inventoryColumns,
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.updateOptionDefaults,
    onSuccess: async () => {
      showToast({ message: "Inventory settings and preferences saved!", type: "SUCCESS" });
      setTimeout(() => {
        navigate('/inventory')
      }, 500)
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  const onSubmit = (data: z.infer<typeof InventorySettingsSchema>) => {
    const settingsData: Record<string, string | string[] | undefined> = { 
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
        <Breadcrumb className="pb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/inventory/settings">Settings & Preferences</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <DefaultOptionsForm />
        <VisibleColumnsForm onTagSelect={setSelectedTags} />
        <SelectOptionsForm />
        <Button type="submit" disabled={isPending} className="gap-2 w-fit self-end">
          {isPending ? <Spinner size={18}/> : null }
          Save changes
        </Button>
      </form>
    </Form>
  )
}

export default SettingsForm;