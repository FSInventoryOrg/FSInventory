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
import { AssetFormData, AssetSchema} from "@/schemas/AddAssetSchema";
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

const AddAsset = ({ defaultValues }: { defaultValues: Defaults }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false); 
  const { showToast } = useAppContext();
  const [tabValue, setTabValue] = useState<"Hardware" | "Software">("Hardware");

  const form = useForm<z.infer<typeof AssetSchema>>({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      code: '',
      type: 'Hardware',
      brand: '',
      modelName: '',
      modelNo: '',
      serialNo: '',
      /* Hardware */
      ...((tabValue === 'Hardware') && {
        category: defaultValues.category,
        processor: '',
        memory: '',
        storage: '',
        status: defaultValues.status,
        assignee: '',
        purchaseDate: undefined,
        supplierVendor: '',
        pezaForm8105: '',
        pezaForm8106: '',
        isRGE: false,
        equipmentType: defaultValues.equipmentType,
        remarks: '',
        deploymentDate: undefined,
        recoveredFrom: '',
        recoveryDate: undefined,
        client: '',
      }),
      /* Software */
      ...((tabValue === 'Hardware') && {
        license: '',
        version: '',
      })
    }
  });

  const handleTabChange = (newValue: "Hardware" | "Software") => {
    setTabValue(newValue);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.addAsset,
    onSuccess: async () => {
      showToast({ message: "New asset added successfully!", type: "SUCCESS" });
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssets"] })
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssetsByStatusAndCategory"] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
    onSettled: async () => {
      setOpen(false);
    }
  });

  const onSubmit = (data: z.infer<typeof AssetSchema>) => {
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
                    <TabsTrigger value="Software" onClick={() => handleTabChange("Software")} disabled>Software</TabsTrigger>
                  </TabsList>
                  <div className="">
                    <TabsContent tabIndex={-1} value="Hardware" className="pb-4 px-3">
                      <GeneralInfoForm />
                      <SystemSpecsForm />
                      <MiscellaneousForm />
                    </TabsContent>
                    <TabsContent value="Software">
                    </TabsContent>
                  </div>     
                </Tabs>            
                <Button type="submit" disabled={isPending} className="gap-2">
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
