import { useEffect, useState } from "react"
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
import { AssetBaseSchema, AssetFormData, HardwareSchema, refineAssetSchema, SoftwareSchema} from "@/schemas/AddAssetSchema";
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
import { Defaults } from '@/types/options';

interface EditAssetProps {
  assetData: AssetType | HardwareType | SoftwareType;
  defaultValues?: Defaults;
  onClose: (close: boolean) => void;
}

const EditAsset = ({ assetData, defaultValues, onClose }: EditAssetProps) => {
  const isHardware = assetData.type === 'Hardware';
  const isSoftware = assetData.type === 'Software';

  const RetrievableAssetSchema = isHardware
    ? HardwareSchema.superRefine(refineAssetSchema(defaultValues?.retrievableStatus)) 
    : SoftwareSchema.superRefine(refineAssetSchema(defaultValues?.retrievableStatus))
  
  const form = useForm<z.infer<typeof AssetBaseSchema>>({
    resolver: zodResolver(RetrievableAssetSchema),
    defaultValues: {
      type: assetData.type,
      code: assetData.code,
      brand: assetData.brand,
      modelName: assetData.modelName,
      modelNo: assetData.modelNo,
      serialNo: assetData.serialNo,
      deploymentDate: assetData.deploymentDate ? new Date(assetData.deploymentDate) : undefined,
      recoveredFrom: assetData.recoveredFrom,
      recoveryDate: assetData.recoveryDate ? new Date(assetData.recoveryDate) : undefined,
      assignee: assetData.assignee,
      category: assetData.category,
      remarks: assetData.remarks,
      notifyRemarks: assetData.notifyRemarks,
      purchaseDate: assetData.purchaseDate ? new Date(assetData.purchaseDate) : undefined,
      status: assetData.status,
      /* Hardware */
      ...(isHardware && {
        processor: (assetData as HardwareType).processor,
        memory: (assetData as HardwareType).memory,
        storage: (assetData as HardwareType).storage,
        supplierVendor: (assetData as HardwareType).supplierVendor,
        pezaForm8105: (assetData as HardwareType).pezaForm8105,
        pezaForm8106: (assetData as HardwareType).pezaForm8106,
        isRGE: (assetData as HardwareType).isRGE,
        equipmentType: (assetData as HardwareType).equipmentType,
        client: (assetData as HardwareType).client,
      }),
      /* Software */
      ...(isSoftware && {
        softwareName: (assetData as SoftwareType).softwareName,
        serialNo: (assetData as SoftwareType).serialNo,
        vendor: (assetData as SoftwareType).vendor,
        license: (assetData as SoftwareType).license,
        licenseType: (assetData as SoftwareType).licenseType,
        licenseCost: (assetData as SoftwareType).licenseCost,
        licenseExpirationDate: (assetData as SoftwareType).licenseExpirationDate ? 
          new Date((assetData as SoftwareType).licenseExpirationDate): undefined,
        version: (assetData as SoftwareType).version,
        noOfLicense: (assetData as SoftwareType).noOfLicense,
        installationPath: (assetData as SoftwareType).installationPath
      })
    }
  });

  const queryClient = useQueryClient()
  const { showToast } = useAppContext();
  const [tabValue, setTabValue] = useState<"Hardware" | "Software">(assetData.type); // State to track the tab value

  const handleTabChange = (newValue: "Hardware" | "Software") => {
    setTabValue(newValue);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.updateAsset,
    onSuccess: async () => {
      showToast({ message: "Asset updated successfully!", type: "SUCCESS" });
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssets"] })
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssetsByStatusAndCategory"] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setTimeout(() => {
        onClose(true)
      }, 100);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

const { isSubmitting, errors} = form.formState

const hasRequiredFields = () => {
  if (!errors) return false
  return Object.values(errors).some((error)=>error.message?.includes('required'))
}

useEffect(()=> {
  if (isSubmitting && errors) {
    if (hasRequiredFields()) showToast({message: "Required fields are missing.", type:"ERROR"})
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [isSubmitting, errors ])

const triggerValidation = () => form?.trigger()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = (data: any) => {

    if (data.status !== defaultValues?.retrievableStatus) {
      data.assignee = '';
      data.deploymentDate = undefined;
    }
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
    // console.log(updatedAsset)
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
                  <Input placeholder="FS-XYZ-A" autoComplete="off" type="input" {...field} readOnly disabled/>
                </FormControl>
                <FormDescription>
                  This the company asset code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Tabs defaultValue='Hardware' value={assetData.type} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Hardware" onClick={() => handleTabChange("Hardware")}>Hardware</TabsTrigger>
              <TabsTrigger value="Software" onClick={() => handleTabChange("Software")} disabled>Software</TabsTrigger>
            </TabsList>
            <div className="">
              <TabsContent tabIndex={-1} value="Hardware" className="pb-4 px-3">
                <GeneralInfoForm />
                <SystemSpecsForm />
                <MiscellaneousForm defaults={defaultValues} mode="edit"/>
              </TabsContent>
              <TabsContent tabIndex={-1} value="Software">
                <GeneralInfoForm />
                <MiscellaneousForm defaults={defaultValues} mode='edit'/>
              </TabsContent>
            </div>     
          </Tabs>            
          <Button type="submit" disabled={isPending} className="gap-2" onClick={triggerValidation}>
            {isPending ? <Spinner size={18}/> : null }
            Save Asset
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default EditAsset;
