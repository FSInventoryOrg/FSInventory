import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { AssetUnionType } from '@/types/asset';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as imsService from '@/ims-service';
import { useAppContext } from '@/hooks/useAppContext';
import { Spinner } from '../Spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React, { useState } from 'react';
import { ArrowFatLinesDown } from '@phosphor-icons/react';
import { EmployeeType } from '@/types/employee';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Defaults } from '@/types/options';
import { RetrieveAssetSchema } from '@/schemas/RetrieveAssetSchema';
import LackingDeploymentDetailsDialog from './LackingDeploymentDetailsDialog';

interface RetrieveAssetProps {
  assetData: AssetUnionType;
  onRetrieve?: () => void;
}

const RetrieveAsset = ({ assetData, onRetrieve }: RetrieveAssetProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const { showToast } = useAppContext();

  const assignee = assetData?._addonData_assignee || assetData?.assignee;

  const form = useForm<z.infer<typeof RetrieveAssetSchema>>({
    resolver: zodResolver(RetrieveAssetSchema),
    defaultValues: {
      code: assetData.code,
      recoveredFrom: assetData.assignee,
      status: 'IT Storage',
    },
  });

  const { data: defaults } = useQuery<Defaults>({
    queryKey: ['fetchOptionValues', 'defaults'],
    queryFn: () => imsService.fetchOptionValues('defaults'),
  });

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
        const employeeList = employees.map(
          (employee: EmployeeType) => `${employee.code}`
        );
        if (employeeList.includes(assetData.assignee)) {
          const assetHistory = {
            deploymentDate: assetData.deploymentDate,
            recoveryDate: assetData.recoveryDate,
            assetCode: assetData.code,
          };
          updateEmployee({
            code: assetData.assignee,
            assetHistory: assetHistory,
          });
        } else {
          showToast({
            message: 'Asset recovered successfully!',
            type: 'SUCCESS',
          });
          queryClient.invalidateQueries({
            queryKey: ['fetchAllAssets', 'Hardware'],
          });
          queryClient.invalidateQueries({
            queryKey: ['fetchAllAssetsByStatusAndCategory'],
          });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          onRetrieve?.();
          setTimeout(() => {
            setOpen(false);
          }, 100);
        }
      }
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const onSubmit = () => {
    if (!assetData.assignee) {
      return setOpenPrompt(true);
    }
    handleRecoverAsset();
  };

  const handleRecoverAsset = () => {
    const [code, status] = form.getValues(['code', 'status']);
    const retrievedAsset = {
      _id: assetData._id,
      code,
      status,
      recoveryDate: new Date(),
      recoveredFrom: assetData.assignee,
    };
    retrieveAsset({ code: assetData.code, retrievedAsset: retrievedAsset });
  };

  React.useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className='w-[90px] justify-between h-8 px-2 gap-2 text-xs font-semibold'
          variant='secondary'
        >
          Recover
          <ArrowFatLinesDown weight='fill' size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent className='h-full overflow-y-scroll w-full'>
        <SheetHeader>
          <SheetTitle>Recover asset {assetData.code}</SheetTitle>
          <SheetDescription>
            Recovering this asset {assignee ? `from ${assignee}` : ''} will
            remove it from their deployed assets list and set the status of this
            asset to '{form.getValues('status')}'.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-4 py-4 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='flex flex-col gap-2 w-full'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='pb-2 '>
                    <FormLabel className='font-medium'>
                      Status for recovered asset
                    </FormLabel>
                    <div className='flex w-full gap-1'>
                      <Select
                        //   disabled={isStatusDataLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select status for recovered asset' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {defaults?.deployableStatus &&
                            defaults.deployableStatus.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                                className='w-full'
                              >
                                {status}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <Button
                type='submit'
                disabled={retrievalPending || updatingEmployee}
                className='gap-2 font-semibold'
              >
                {retrievalPending || updatingEmployee ? (
                  <Spinner size={18} />
                ) : null}
                Recover {assetData.code}
              </Button>
            </SheetFooter>
          </form>
        </Form>
        <LackingDeploymentDetailsDialog
          open={openPrompt}
          setOpen={setOpenPrompt}
          asset={assetData}
          onRecoverAsset={handleRecoverAsset}
        />
      </SheetContent>
    </Sheet>
  );
};

export default RetrieveAsset;
