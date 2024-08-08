import { useState, useEffect } from 'react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import AssetsCount from './AssetCounts';
import { Skeleton } from '../ui/skeleton';
// import { Skeleton } from '../ui/skeleton';

interface DeploymentInfoProps {
  employee: EmployeeType;
  assignee: string;
}

const DeploymentInfo = ({ employee, assignee }: DeploymentInfoProps) => {
  const currentDate = new Date();
  const [isSM, setIsSM] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('current');
  const [assetsCurrent, setAssetsCurrent] = useState<HardwareType[] | null>(
    null
  );
  const [assetsHistory, setAssetsHistory] = useState<HardwareType[] | null>(
    null
  );
  const [assetCounts, setAssetCounts] = useState<{
    [category: string]: number;
  }>();

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

  const countAssetsByCategory = (
    assets: HardwareType[]
  ): { [category: string]: number } => {
    const assetCounts: { [category: string]: number } = {};
    assets.forEach((asset: HardwareType) => {
      const category = asset.category;
      assetCounts[category] = (assetCounts[category] || 0) + 1;
    });

    return assetCounts;
  };

  useEffect(() => {
    if (employee.assetsHistory && allAssets) {
      const assetsFromHistory: HardwareType[] = [];
      employee.assetsHistory.forEach((history: AssetsHistory) => {
        const asset = allAssets.find(
          (asset: HardwareType) => asset.code === history.assetCode
        );
        if (asset) {
          assetsFromHistory.push(asset);
        }
      });
      setAssetsHistory([...assetsFromHistory]);
    }
  }, [employee, allAssets]);

  useEffect(() => {
    if (currentAssets) {
      setAssetsCurrent([...currentAssets]);
    }
  }, [currentAssets]);

  useEffect(() => {
    if (selectedFilter === 'current' && assetsCurrent) {
      const counts = countAssetsByCategory(assetsCurrent);
      setAssetCounts(counts);
    } else if (selectedFilter === 'history' && assetsHistory) {
      const counts = countAssetsByCategory(assetsHistory);
      setAssetCounts(counts);
    }
  }, [selectedFilter, assetsCurrent, assetsHistory]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSM(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-2 pb-2">
        <div
          id="banner"
          className="bg-gradient-to-br from-[#1d2436] to-[#006e54] h-40 rounded-lg p-4 justify-between flex flex-col text-white"
        >
          <div className="flex justify-between ">
            <div className="flex flex-col w-[50%] sm:w-full">
              <span className="font-bold text-xl sm:text-3xl gap-2 flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-fit overflow-hidden text-ellipsis">
                      <span className="whitespace-nowrap">
                        {employee.firstName + ' ' + employee.lastName}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {employee.firstName + ' ' + employee.lastName}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {employee.isRegistered && isSM && (
                  <EditEmployee employeeData={employee} />
                )}
              </span>
              <span
                className={`font-bold text-sm ${
                  employee.isRegistered ? '' : 'text-destructive text-sm'
                }`}
              >
                {employee.isRegistered ? employee.code : 'UNREGISTERED'}
              </span>
            </div>
            <div className="flex gap-1 sm:gap-2 lg:gap-3 items-start">
              {!isSM && <EditEmployee employeeData={employee} />}
              <DeleteEmployee employee={employee} />
              <Button
                className={`px-3 sm:px-4 gap-2 text-white ${
                  employee.isActive
                    ? 'bg-[#33CC80]'
                    : 'bg-[#ffa333] hover:bg-[#ffa333]/95'
                }`}
              >
                {employee.isActive ? (
                  <>
                    <CheckCheckIcon size={16} />
                    <span className="hidden sm:block">Active</span>
                  </>
                ) : (
                  <>
                    <AlertCircleIcon size={16} />
                    <span className="hidden sm:block">Inactive</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col justify-between">
            <div className="flex flex-row text-white w-full sm:w-[50%]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-fit text-xl sm:text-4xl font-bold text-primary/50 overflow-hidden text-ellipsis">
                    <span className="whitespace-nowrap">
                      {employee.position}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{employee.position}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex">
              <span className="text-muted-foreground font-medium text-xs sm:text-sm self-end text-ellipsis overflow-hidden whitespace-nowrap">
                As of {currentDate.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div id="statistics" className="relative">
          {assetCounts ? (
            <AssetsCount assetCounts={assetCounts} />
          ) : (
            <div className="flex flex-row gap-2 cursor-pointer w-fit h-[70px]">
              <Skeleton className="flex flex-col bg-secondary rounded-lg px-4 py-2 w-[125px]" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 pb-2">
        <Select
          value={selectedFilter}
          onValueChange={(value) => setSelectedFilter(value)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue defaultValue="current" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter by</SelectLabel>
              <SelectItem value="current">Current deployed assets</SelectItem>
              <SelectItem value="history" disabled={!employee.code}>
                History of deployed assets
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={20} className="text-border cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[200px]">
                Assets history for{' '}
                <span className="text-destructive">unregistered</span> users is
                not available.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {selectedFilter === 'current' ? (
        assetsCurrent !== null ? (
          <EmployeeAssetsTable
            columns={EmployeeAssetsColumns}
            data={assetsCurrent}
          />
        ) : (
          <div className="flex relative w-full h-full justify-center items-center border rounded-md">
            <div className="h-12 bg-accent w-full absolute top-0 rounded-t-md" />
            <Spinner className="text-muted-foreground" />
          </div>
        )
      ) : assetsHistory !== null ? (
        <AssetsHistoryTable
          employee={employee}
          columns={AssetsHistoryColumns}
          data={assetsHistory}
        />
      ) : (
        <div className="flex relative w-full h-full justify-center items-center border rounded-md">
          <div className="h-12 bg-accent w-full absolute top-0 rounded-t-md" />
          <Spinner className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

const DeleteEmployee = ({ employee }: { employee: EmployeeType }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isSM, setIsSM] = useState(false);

  const { data: employeeAssets } = useQuery<string[]>({
    queryKey: ['fetchAssetsByProperty'],
    queryFn: () => imsService.fetchAssetsByProperty('assignee', employee.code),
    enabled: !!employee.code,
  });

  const handleDeleteEmployee = async () => {
    await imsService.deleteEmployeeByCode(employee.code);
    queryClient.invalidateQueries({ queryKey: ['fetchEmployees'] });

    window.location.replace('/tracker');
    setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSM(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {isSM ? (
          <Button
            disabled={!employee.isRegistered}
            className="px-3 sm:px-4 gap-2 bg-destructive/20 border-destructive border text-destructive hover:text-destructive-foreground"
            variant="destructive"
          >
            <TrashIcon size={16} />
            <span className="hidden sm:block">Remove Employee</span>
          </Button>
        ) : (
          <Button
            size="icon"
            className="text-white flex justify-center items-center rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-transparent hover:bg-muted-foreground/20 border-0"
          >
            <TrashIcon size={16} />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none">
        {!(employeeAssets && employeeAssets.length > 0) ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently unregister
                this employee.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <TrashCan />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteEmployee} variant="destructive">
                Yes, I want to remove{' '}
                {employee.firstName + ' ' + employee.lastName}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Cannot remove this employee</AlertDialogTitle>
              <AlertDialogDescription>
                There are {employeeAssets?.length || 0} assets deployed to{' '}
                {employee.firstName + ' ' + employee.lastName}. Recover these
                assets and try again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeploymentInfo;
