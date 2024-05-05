'use client'

import React from 'react';
import CountUp from 'react-countup';
import { motion } from "framer-motion"
import * as imsService from '@/ims-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AssetsHistory, EmployeeType } from '@/types/employee';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button';
import { AlertCircleIcon, CheckCheckIcon, TrashIcon } from 'lucide-react';
import TrashCan from '../graphics/TrashCan';
import EditEmployee from './EditEmployee';
import { EmployeeAssetsTable } from './EmployeeAssetsTable';
import { EmployeeAssetsColumns } from './EmployeeAssetsColumns';
import { HardwareType } from '@/types/asset';
import { Spinner } from '../Spinner';
import { AssetsHistoryTable } from './AssetsHistoryTable';
import { AssetsHistoryColumns } from './AssetsHistoryColumns';
import { Info } from '@phosphor-icons/react';

interface DeploymentInfoProps {
  employee: EmployeeType;
  assignee: string;
}

const DeploymentInfo = ({ employee, assignee }: DeploymentInfoProps) => {
  const [selectedFilter, setSelectedFilter] = React.useState('current');
  const [expanded, setExpanded] = React.useState(true);
  const [assetsCurrent, setAssetsCurrent] = React.useState<HardwareType[] | null>(null);
  const [assetsHistory, setAssetsHistory] = React.useState<HardwareType[] | null>(null);
  const [assetCounts, setAssetCounts] = React.useState<{ [category: string]: number } | []>([]);

  const { data: allAssets } = useQuery({ 
    queryKey: ['fetchAllAssets'], 
    queryFn: () => imsService.fetchAllAssets(),
    enabled: !!employee.code,
  });


  const { data: currentAssets } = useQuery({ 
    queryKey: ['fetchAssetsByProperty', 'assignee', assignee], 
    queryFn: () => imsService.fetchAssetsByProperty('assignee', assignee),
    enabled: !!employee,
  });

  const countAssetsByCategory = (assets: HardwareType[]): { [category: string]: number } => {
    const assetCounts: { [category: string]: number } = {};
    assets.forEach((asset: HardwareType) => {
      const category = asset.category;
      assetCounts[category] = (assetCounts[category] || 0) + 1;
    });
  
    return assetCounts;
  };

  const currentDate = new Date();

  React.useEffect(() => {
    if (employee.assetsHistory && allAssets) {
      const assetsFromHistory: HardwareType[] = [];
      employee.assetsHistory.forEach((history: AssetsHistory) => {
        const asset = allAssets.find((asset: HardwareType) => asset.code === history.assetCode);
        if (asset) {
          assetsFromHistory.push(asset);
        }
      });
      setAssetsHistory([...assetsFromHistory]);
    }
  }, [employee, allAssets]);

  React.useEffect(() => {
    if (currentAssets) {
      setAssetsCurrent([...currentAssets])
    }
  }, [currentAssets])

  React.useEffect(() => {
    console.log(selectedFilter)
    if (selectedFilter === 'current') {
      const counts = assetsCurrent ? countAssetsByCategory(assetsCurrent) : {};
      console.log(counts)
      setAssetCounts(counts)
    } else {
      const counts = assetsHistory ? countAssetsByCategory(assetsHistory) : {};
      setAssetCounts(counts)
    }
  }, [selectedFilter, assetsCurrent, assetsHistory]);  

  console.log(assetsCurrent)

  return (
    <>
      <div className='h-full flex flex-col'>
        <div className='flex flex-col gap-2 pb-2'>
          <div id='banner' className='bg-gradient-to-br from-[#1d2436] to-[#006e54] h-40 rounded-lg p-4 justify-between flex flex-col text-white'>
            <div className='flex justify-between '>
              <div className='flex flex-col'>
                <span className='font-bold text-3xl gap-2 flex'>
                  {employee.firstName + ' ' + employee.lastName}
                  {employee.isRegistered && <EditEmployee employeeData={employee} />}
                </span>
                <span className={`font-bold ${employee.isRegistered ? '' : 'text-destructive text-sm'}`}>
                  {employee.isRegistered ? employee.code : 'UNREGISTERED'}
                </span>
              </div>
              <div className='flex gap-3'>
                <DeleteEmployee employee={employee} />
                <Button className={`gap-2 text-white ${employee.isActive ? 'bg-[#33CC80]' : 'bg-[#ffa333] hover:bg-[#ffa333]/95'}`}>
                  {employee.isActive ? (
                    <>
                      <CheckCheckIcon size={16} />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircleIcon size={16} />
                      Inactive
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex flex-row text-white w-[50%]'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className='w-fit text-4xl font-bold text-primary/50 overflow-hidden text-ellipsis'>
                      <span className='whitespace-nowrap'>{employee.position}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {employee.position}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className='flex'>
                <span className='text-muted-foreground font-medium text-sm self-end text-ellipsis overflow-hidden whitespace-nowrap'>As of {currentDate.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div id='statistics' className='relative'>
            <div 
              className='flex flex-row gap-2 cursor-pointer w-fit'
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              <div className='flex flex-col bg-secondary rounded-lg border px-4 py-2 w-[125px]'>
                <span className='text-xs font-bold text-accent-foreground self-end overflow-ellipsis whitespace-nowrap'>TOTAL ASSETS</span>
                <span className='text-3xl font-bold text-accent-foreground self-end'>
                  <CountUp start={0} end={Object.values(assetCounts).reduce((acc, count) => acc + count, 0)} delay={0} duration={1}>
                    {({ countUpRef }) => (
                      <div>
                        <span ref={countUpRef} />
                      </div>
                    )}
                  </CountUp>
                </span>
              </div>
              {Object.entries(assetCounts).map(([category, count], index) => (
                <motion.div
                  initial={{ x: 0 }} // Ensure lower index has higher zIndex
                  animate={{ x: expanded ? (100 * (index+1)) : (15 * (index+1)) }}
                  transition={{ type: 'spring', ease: "easeInOut", duration: 0.2, delay: index * 0.05 }} // Adjust delay for staggered animation
                  key={category}
                  className='w-[125px] flex flex-col bg-accent rounded-lg border px-4 py-2 absolute top-0 left-0'
                  style={{ zIndex: -(index+1) }} // Ensure zIndex transitions properly
                >
                  <span className='text-xs font-bold text-muted-foreground text-end text-ellipsis overflow-hidden whitespace-nowrap w-full'>{category.toUpperCase()}</span>
                  <span className='text-3xl font-bold text-accent-foreground self-end'>
                    <CountUp start={0} end={count} delay={0.05} duration={1}>
                      {({ countUpRef }) => (
                        <div>
                          <span ref={countUpRef} />
                        </div>
                      )}
                    </CountUp>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 pb-2'>
          <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue defaultValue="current" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter by</SelectLabel>
                <SelectItem value="current">Current deployed assets</SelectItem>
                <SelectItem value="history" disabled={!employee.code}>History of deployed assets</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={20} className='text-border cursor-pointer' />
              </TooltipTrigger>
              <TooltipContent>
                <p className='max-w-[200px]'>Assets history for <span className='text-destructive'>unregistered</span> users is not available.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {(selectedFilter === 'current') ? (
          (assetsCurrent !== null) ? (
            <EmployeeAssetsTable columns={EmployeeAssetsColumns} data={assetsCurrent} /> 
          ) : ( 
            <div className='flex relative w-full h-full justify-center items-center border rounded-md'>
              <div className='h-12 bg-accent w-full absolute top-0 rounded-t-md' />
              <Spinner className='text-muted-foreground'/>
            </div>
          )
        ) : (
          (assetsHistory !== null) ? (
            <AssetsHistoryTable columns={AssetsHistoryColumns} data={assetsHistory} /> 
          ) : (
            <div className='flex relative w-full h-full justify-center items-center border rounded-md'>
              <div className='h-12 bg-accent w-full absolute top-0 rounded-t-md' />
              <Spinner className='text-muted-foreground'/>
            </div>
          )
        )}
      </div>
    </>
  )
}

const DeleteEmployee = ({ employee }: { employee: EmployeeType }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false); 
  const handleDeleteEmployee = async () => {
    await imsService.deleteEmployeeByCode(employee.code);
    queryClient.invalidateQueries({ queryKey: ["fetchEmployees"] })
    setTimeout(() => {
      setOpen(false);
    }, 100)
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          disabled={!employee.isRegistered}
          className='gap-2 bg-destructive/30 border-destructive border text-destructive hover:text-destructive-foreground'
          variant='destructive'
        >
          <TrashIcon size={16} />
          Remove Employee
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            employee and assets assigned to this employee will be set to IT Storage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <TrashCan />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDeleteEmployee} variant='destructive'>Yes, I want to remove {employee.name}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeploymentInfo