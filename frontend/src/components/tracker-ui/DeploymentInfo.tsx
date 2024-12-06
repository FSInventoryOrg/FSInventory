import { useState, useEffect } from "react";
import * as imsService from "@/ims-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AssetsHistory, EmployeeType } from "@/types/employee";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Check, X, XIcon } from "lucide-react";
import TrashCan from "../graphics/TrashCan";
import EditEmployee from "./EditEmployee";
import { EmployeeAssetsTable } from "./EmployeeAssetsTable";
import { EmployeeAssetsColumns } from "./EmployeeAssetsColumns";
import { HardwareType } from "@/types/asset";
import { Spinner } from "../Spinner";
import { AssetsHistoryTable } from "./AssetsHistoryTable";
import { AssetsHistoryColumns } from "./AssetsHistoryColumns";
import { Info } from "@phosphor-icons/react";
import AssetsCount from "./AssetCounts";
import { Skeleton } from "../ui/skeleton";
import { Label } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { EmployeeDropdownMenu } from "./EmployeeDropdownMenu";
import { DropdownMenuItem } from "../ui/dropdown-menu";
// import { Skeleton } from '../ui/skeleton';

interface DeploymentInfoProps {
  employee: EmployeeType;
  assignee: string;
}

const UnregisteredBadge = () => {
  return (
    <div className="py-[2px] px-2 bg-destructive rounded-[8px] w-fit">
      <Label className="text-sm font-semibold text-white">UNREGISTERED</Label>
    </div>
  );
};

const DeploymentInfo = ({ employee, assignee }: DeploymentInfoProps) => {
  const currentDate = new Date();
  const [isSM, setIsSM] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("current");
  const [assetsCurrent, setAssetsCurrent] = useState<HardwareType[] | null>(
    null
  );
  const [assetsHistory, setAssetsHistory] = useState<HardwareType[] | null>(
    null
  );
  const [assetCounts, setAssetCounts] = useState<{
    [category: string]: number;
  }>();
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const { data: allAssets } = useQuery({
    queryKey: ["fetchAllAssets"],
    queryFn: () => imsService.fetchAllAssets(),
    enabled: !!employee.code,
  });

  const { data: currentAssets } = useQuery({
    queryKey: ["fetchAssetsByProperty", "assignee", assignee.trim()],
    queryFn: () => imsService.fetchAssetsByProperty("assignee", assignee),
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
    if (selectedFilter === "current" && assetsCurrent) {
      const counts = countAssetsByCategory(assetsCurrent);
      setAssetCounts(counts);
    } else if (selectedFilter === "history" && assetsHistory) {
      const counts = countAssetsByCategory(assetsHistory);
      setAssetCounts(counts);
    }
  }, [selectedFilter, assetsCurrent, assetsHistory]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSM(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col lg:flex-row gap-2 pb-2">
        <div
          id="banner"
          className="w-full pr-2 md:w-[95%] lg:w-[50%] flex-shrink flex-grow dark:bg-gradient-120 bg-gradient-302 from-tracker-from to-tracker-to h-40 rounded-lg p-4 justify-between flex flex-col text-white border border-solid border-border-brandgreen"
        >
          <div className="flex justify-between ">
            <div className="flex flex-col w-[50%] sm:w-full gap-1">
              <span className="font-bold text-xl sm:text-3xl gap-2 flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-fit text-ellipsis">
                      <span className="whitespace-nowrap text-primary-foreground text-4xl">
                        {employee.firstName + " " + employee.lastName}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {employee.firstName + " " + employee.lastName}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span
                className={cn(
                  "text-primary-foreground text-[16px]",
                  employee.isRegistered
                    ? "dark:text-white text-primary-foreground"
                    : "text-destructive text-[16px]"
                )}
              >
                {employee.isRegistered ? employee.code : <UnregisteredBadge />}
              </span>
            </div>
            <div className="flex gap-1 sm:gap-2 lg:gap-3 items-start pt-2">
              <Button
                className={cn(
                  "py-[2px] px-2 gap-1 text-white rounded-[20px] h-[28px] hover:cursor-auto",
                  employee.isActive
                    ? "dark:bg-[#036F39] bg-[#CAEADA] hover:bg-[#CAEADA]"
                    : "dark:bg-[#54575A] hover:bg-[#DBDCDC]/95 bg-[#DBDCDC]"
                )}
              >
                {employee.isActive ? (
                  <>
                    <Check
                      size={16}
                      className="text-border-brandgreen dark:text-white"
                    />
                    <span className="hidden sm:block text-[16px] dark:text-white text-border-brandgreen">
                      ACTIVE
                    </span>
                  </>
                ) : (
                  <>
                    <X size={16} className="dark:text-white text-[#54575A]" />
                    <span className="hidden sm:block text-[16px] dark:text-white text-[#54575A]">
                      INACTIVE
                    </span>
                  </>
                )}
              </Button>
              <EmployeeDropdownMenu
                open={showEmployeeDropdown}
                setOpen={setShowEmployeeDropdown}
                dropdownMenuContentClassName={isSM ? "lg:mr-[200px] " : ""}
              >
                <DropdownMenuItem
                  className="dark:bg-[#141D1E] bg-white p-0"
                  asChild
                >
                  {employee.isRegistered && (
                    <EditEmployee
                      employeeData={employee}
                      buttonText="Edit Employee"
                    />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="bg-[#141D1E] w-full p-0" asChild>
                  <DeleteEmployee employee={employee} />
                </DropdownMenuItem>
              </EmployeeDropdownMenu>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col justify-between">
            <div className="flex flex-row text-white w-full sm:w-[50%]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-fit text-xl sm:text-4xl font-bold text-primary/50 text-ellipsis">
                    <span className="whitespace-nowrap dark:text-primary/50 text-primary text-xl">
                      {employee.position}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{employee.position}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div id="statistics" className="relative flex-grow ">
          {assetCounts ? (
            <AssetsCount assetCounts={assetCounts} />
          ) : (
            <div className="flex flex-row gap-2 cursor-pointer w-fit h-[70px]">
              <Skeleton className="flex flex-col bg-secondary rounded-lg px-4 py-2 w-[125px]" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 px-1">
        <div className="flex">
          <span className="dark:text-[#D9F2F2] font-medium text-xs sm:text-sm self-end text-ellipsis overflow-hidden whitespace-nowrap">
            As of {currentDate.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-center items-center gap-4">
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
                <Info
                  size={24}
                  className="dark:text-[#D9F2F2] cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px]">
                  Assets history for{" "}
                  <span className="text-destructive">unregistered</span> users
                  is not available.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {selectedFilter === "current" ? (
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
    queryKey: ["fetchAssetsByProperty"],
    queryFn: () => imsService.fetchAssetsByProperty("assignee", employee.code),
    enabled: !!employee.code,
  });

  const handleDeleteEmployee = async () => {
    await imsService.deleteEmployeeByCode(employee.code);
    queryClient.invalidateQueries({ queryKey: ["fetchEmployees"] });

    window.location.replace("/tracker");
    setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSM(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={!employee.isRegistered}
          className="px-3 sm:px-4 gap-2 bg-transparent text-destructive hover:text-white hover:bg-destructive/80"
        >
          <XIcon size={isSM ? 20 : 16} />
          <span className="text-[16px]">Remove Employee</span>
        </Button>
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
                Yes, I want to remove{" "}
                {employee.firstName + " " + employee.lastName}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Cannot remove this employee</AlertDialogTitle>
              <AlertDialogDescription>
                There are {employeeAssets?.length || 0} assets deployed to{" "}
                {employee.firstName + " " + employee.lastName}. Recover these
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
