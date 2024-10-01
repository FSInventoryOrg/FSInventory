import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form
} from "@/components/ui/form"
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import { Spinner } from '../Spinner'
import { PlusIcon, XIcon } from "lucide-react"
import { AssetFormData, HardwareSchema, refineAssetSchema, SoftwareSchema} from "@/schemas/AddAssetSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
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
import { Defaults } from "@/types/options";

type AssetType = "Hardware" | "Software"

const AddAsset = ({ defaultValues }: { defaultValues: Defaults }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false); 
  const { showToast } = useAppContext();
  const [tabValue, setTabValue] = useState<AssetType>("Hardware");

  const RetrievableAssetSchema = tabValue === 'Hardware'
    ? HardwareSchema.superRefine(refineAssetSchema(defaultValues?.retrievableStatus)) 
    : SoftwareSchema.superRefine(refineAssetSchema(defaultValues?.retrievableStatus))

  const defaultAssetValues = { code: '',
    brand: '',
    modelName: '',
    modelNo: '',
    serialNo: '',
    remarks: '',
    notifyRemarks: true,
    deploymentDate: undefined,
    recoveredFrom: '',
    recoveryDate: undefined,
    assignee: '',
    status: defaultValues.status}

  const hardwareDefaultValues = {
    ...defaultAssetValues,
    category: defaultValues.hardwareCategory,
    processor: '',
    memory: '',
    storage: '',
    type: 'Hardware' as AssetType,
    purchaseDate: undefined,
    supplierVendor: '',
    pezaForm8105: '',
    pezaForm8106: '',
    isRGE: false,
    equipmentType: defaultValues.equipmentType,
    client: '',
  }
  
  const softwareDefaultValues = {
    ...defaultAssetValues,
    category: defaultValues.softwareCategory,
    vendor: '',
    licenseType: '',
    purchaseDate: undefined,
    licenseExpirationDate: undefined,
    type: undefined,
    license: '',
    version: '',
    noOfLicense: '1',
    licenseCost: ''
  }
  const form = useForm<z.infer<typeof HardwareSchema>>({
    resolver: zodResolver(RetrievableAssetSchema),
    defaultValues: {
      /* Hardware */
      ...((tabValue === 'Hardware') && hardwareDefaultValues),
      /* Software */
      ...((tabValue === 'Software') && softwareDefaultValues)
    }
  });

  const { isSubmitting, errors} = form.formState

  const handleTabChange = (newValue: AssetType) => {
    if (newValue === 'Hardware') {
      form.reset(hardwareDefaultValues)
    } else {
      form.reset(softwareDefaultValues)
    }
    form.setValue('type', newValue)
    setTabValue(newValue);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.addAsset,
    onSuccess: async () => {
      showToast({ message: "New asset added successfully!", type: "SUCCESS" });
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssets"] })
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssetsByStatusAndCategory"] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setTimeout(() => {
        setOpen(false);
      }, 100);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

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

  const onSubmit = (data: z.infer<typeof HardwareSchema>) => {
    const assetData: AssetFormData = {
      ...data,
      type: tabValue,
    }
    mutate(assetData)
  }

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-2 h-8 gap-1 font-semibold">
          <span className="hidden md:inline-block text-sm">Add Asset</span>
          <PlusIcon className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent tabIndex={-1} className="min-w-full overflow-y-auto h-full bg-transparent justify-center flex border-none px-0 py-0 sm:py-16">
        <div className="sm:max-w-[800px] bg-card h-fit p-3 sm:p-6 rounded-lg">
          <DialogHeader className="relative">
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogTitle>Add a new asset</DialogTitle>
            <DialogDescription className="text-accent-foreground text-sm">
              Select an asset type: hardware or software, and fill in the respective forms. Most fields are optional, but other fields such as the asset code are required.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Form {...form}>
              <form className="flex flex-col w-full gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue="Hardware" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Hardware" onClick={() => handleTabChange("Hardware")}>Hardware</TabsTrigger>
                    <TabsTrigger value="Software" onClick={() => handleTabChange("Software")}>Software</TabsTrigger>
                  </TabsList>
                  <div className="">
                    <TabsContent tabIndex={-1} value="Hardware" className="pb-4 px-3">
                      <GeneralInfoForm />
                      <SystemSpecsForm />
                      <MiscellaneousForm defaults={defaultValues} mode='new'/>
                    </TabsContent>
                    <TabsContent value="Software" className="pb-4 px-3">
                      <GeneralInfoForm />
                      <MiscellaneousForm defaults={defaultValues} mode='new'/>
                    </TabsContent>
                  </div>     
                </Tabs>            
                <Button type="submit" disabled={isPending} className="gap-2" onClick={triggerValidation}>
                  {isPending ? <Spinner size={18}/> : null }
                  Add Asset
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddAsset
