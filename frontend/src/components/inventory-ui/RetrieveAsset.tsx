import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HardwareType } from "@/types/asset"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import { Spinner } from '../Spinner'
import Retrieve from "../graphics/Retrieve";
import { ArrowFatLinesDown } from "@phosphor-icons/react";
import { useState } from "react";
import { EmployeeType } from "@/types/employee";

interface DeployAssetProps {
  assetData: HardwareType;
  onRetrieve?: () => void;
}
const RetrieveAsset = ({ assetData, onRetrieve }: DeployAssetProps) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false);
  const { showToast } = useAppContext();
  
  const { data: employees } = useQuery<EmployeeType[]>({ 
    queryKey: ['fetchAllEmployees'], 
    queryFn: () => imsService.fetchAllEmployees(),
  });

  const { mutate: updateEmployee, isPending: updatingEmployee } = useMutation({
    mutationFn: imsService.updateEmployeeAssetHistory,
    onSuccess: async () => {
      showToast({ message: 'Asset recovered successfully!', type: 'SUCCESS' });
      queryClient.invalidateQueries({ queryKey: ['fetchAllAssets'] });
      queryClient.invalidateQueries({ queryKey: ['fetchAssetsByProperty'] });
      queryClient.invalidateQueries({
        queryKey: ['fetchAllAssetsByStatusAndCategory'],
      });
      queryClient.invalidateQueries({ queryKey: ['fetchEmployees'] });
      queryClient.invalidateQueries({ queryKey: ['fetchEmployeeByCode'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setTimeout(() => {
        setOpen(false);
      }, 100);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const { mutate: retrieveAsset, isPending: retrievalPending } = useMutation({
    mutationFn: imsService.retrieveAsset,
    onSuccess: async () => {
      if (employees) {
        const employeeList = employees.map((employee: EmployeeType) => `${employee.code}`);
        if (employeeList.includes(assetData.assignee)) {
          const assetHistory = {
            deploymentDate: assetData.deploymentDate,
            recoveryDate: assetData.recoveryDate,
            assetCode: assetData.code
          }
          updateEmployee({ code: assetData.assignee, assetHistory: assetHistory })
        } else {
          showToast({ message: "Asset recovered successfully!", type: "SUCCESS" });
          queryClient.invalidateQueries({ queryKey: ['fetchAllAssets', 'Hardware'] });
          queryClient.invalidateQueries({
            queryKey: ['fetchAllAssetsByStatusAndCategory'],
          });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          onRetrieve?.()
          setTimeout(() => {
            setOpen(false)
          }, 100)
        }
      }
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  const onSubmit = () => {
    const retrievedAsset = {
      _id: assetData._id,
      code: assetData.code,
      recoveryDate: new Date(),
      recoveredFrom: assetData.assignee,
    };
    retrieveAsset({ code: assetData.code, retrievedAsset: retrievedAsset });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-[90px] justify-between h-8 px-2 gap-2 text-xs font-semibold" variant='secondary'>
          Recover
          <ArrowFatLinesDown weight="fill" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Recover asset {assetData.code}?</DialogTitle>
          <DialogDescription className="">
            Recovering this asset from {assetData?._addonData_assignee || assetData.assignee} will remove it from their deployed assets list and set the status of this asset to 'IT Storage'.
          </DialogDescription>
          <Retrieve />
        </DialogHeader>
        <DialogFooter>
          <Button 
            type="button" 
            disabled={(retrievalPending || updatingEmployee)} 
            className="gap-2 font-semibold"
            onClick={() => {
              onSubmit();
            }}
          >
            {(retrievalPending || updatingEmployee) ? <Spinner size={18}/> : null }
            Yes, I want to recover it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RetrieveAsset;