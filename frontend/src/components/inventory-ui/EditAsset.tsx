import { useState } from "react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import { Spinner } from '../Spinner'
import { AssetFormData, AssetSchema} from "@/schemas/AddAssetSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { z } from "zod";
import GeneralInfoForm from "./GeneralInfoForm";
import SystemSpecsForm from "./SystemSpecsForm";
import MiscellaneousForm from "./MiscellaneousForm";
import { AssetType, HardwareType, SoftwareType } from "@/types/asset";

interface EditAssetProps {
  assetData: AssetType | HardwareType | SoftwareType;
  onClose: (close: boolean) => void;
}

const EditAsset = ({ assetData, onClose }: EditAssetProps) => {
  const isHardware = assetData.type === 'Hardware';
  const isSoftware = assetData.type === 'Software';

  const form = useForm<z.infer<typeof AssetSchema>>({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      code: assetData.code,
      type: assetData.type,
      brand: assetData.brand,
      modelName: assetData.modelName,
      modelNo: assetData.modelNo,
      serialNo: assetData.serialNo,
      /* Hardware */
      ...(isHardware && {
        category: (assetData as HardwareType).category,
        processor: (assetData as HardwareType).processor,
        memory: (assetData as HardwareType).memory,
        storage: (assetData as HardwareType).storage,
        status: (assetData as HardwareType).status,
        assignee: (assetData as HardwareType).assignee,
        purchaseDate: (assetData as HardwareType).purchaseDate ? new Date((assetData as HardwareType).purchaseDate) : undefined,
        supplierVendor: (assetData as HardwareType).supplierVendor,
        pezaForm8105: (assetData as HardwareType).pezaForm8105,
        pezaForm8106: (assetData as HardwareType).pezaForm8106,
        isRGE: (assetData as HardwareType).isRGE,
        equipmentType: (assetData as HardwareType).equipmentType,
        remarks: (assetData as HardwareType).remarks,
        deploymentDate: (assetData as HardwareType).deploymentDate ? new Date((assetData as HardwareType).deploymentDate) : undefined,
        recoveredFrom: (assetData as HardwareType).recoveredFrom,
        recoveryDate: (assetData as HardwareType).recoveryDate ? new Date((assetData as HardwareType).recoveryDate) : undefined,
        client: (assetData as HardwareType).client,
      }),
      /* Software */
      ...(isSoftware && {
        license: (assetData as SoftwareType).license,
        version: (assetData as SoftwareType).version,
      })
    }
  });

  const queryClient = useQueryClient()
  const { showToast } = useAppContext();
  const [tabValue, setTabValue] = useState<"Hardware" | "Software">("Hardware"); // State to track the tab value

  const handleTabChange = (newValue: "Hardware" | "Software") => {
    setTabValue(newValue);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.updateAsset,
    onSuccess: async () => {
      showToast({ message: "Asset updated successfully!", type: "SUCCESS" });
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssets"] })
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssetsByStatusAndCategory"] })
      queryClient.invalidateQueries({ queryKey: ["fetchEmployeeByCode"] })
      setTimeout(() => {
        onClose(true)
      }, 100)
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

const onSubmit = (data: z.infer<typeof AssetSchema>) => {
    // Check each field and set it to undefined if it's null
    if (data.recoveryDate === null) {
      data.recoveryDate = undefined;
    }
    if (data.purchaseDate === null) {
      data.purchaseDate = undefined;
    }
    if (data.deploymentDate === null) {
      data.deploymentDate = undefined;
    }
  
    const updatedAsset: AssetFormData & { _id: string } = {
      ...data,
      _id: assetData._id,
      type: tabValue,
    }
    console.log(updatedAsset)
    mutate({ code: assetData.code, updatedAsset: updatedAsset });
  }

  return (
    <div className="">
      <Form {...form}>
        <form className="flex flex-col w-full gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className='w-1/2'>
                <FormLabel className='text-md text-secondary-foreground'>Asset Code</FormLabel>
                <FormControl>
                  <Input placeholder="FS-XYZ-A" autoComplete="off" type="input" {...field} />
                </FormControl>
                <FormDescription>
                  This the company asset code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Tabs defaultValue="Hardware" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Hardware" onClick={() => handleTabChange("Hardware")}>Hardware</TabsTrigger>
              <TabsTrigger value="Software" onClick={() => handleTabChange("Software")} disabled>Software</TabsTrigger>
            </TabsList>
            <div className="">
              <TabsContent tabIndex={-1} value="Hardware" className="pb-4 px-3">
                <GeneralInfoForm assetStatus={(assetData as HardwareType).status} />
                <SystemSpecsForm />
                <MiscellaneousForm />
              </TabsContent>
              <TabsContent tabIndex={-1} value="Software">
              </TabsContent>
            </div>     
          </Tabs>            
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Spinner size={18}/> : null }
            Save Asset
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default EditAsset;
