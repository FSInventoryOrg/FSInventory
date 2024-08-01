import { HardwareType, SoftwareType } from '@/types/asset'
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import LatestAssetsTable from './LatestAssetsTable';
import HardwareDistPie from './HardwareDistPie';
import { interpolateRgbBasis } from 'd3-interpolate';
import StatusByCategoryBar from './StatusByCategoryBar';
import StatusByCategoryLegend from './StatusByCategoryLegend';
import HardwareDistLegend from './HardwareDistLegend';
import LaptopServiceYearsBar from './LaptopServiceYearsBar';
import { useQuery } from '@tanstack/react-query';
import * as imsService from '@/ims-service';
import AssetsOverview from './AssetsOverview';
import EmployeesOverview from './EmployeesOverview';
import BundlesOverview from './BundlesOverview';
import AssetTypeDistribution from './AssetTypeDistribution';
import { EmployeeType } from '@/types/employee';
import { COLORS } from '@/lib/data';

//! NEEDS FURTHER REFACTORING / MODULARIZATION

/* Types and Props */

interface DashboardLayoutProps {
  assetData: HardwareType[] & SoftwareType[];
  hardwareData: HardwareType[];
}

export type StatusOptions = {
  value: string;
  color?: string;
};

export type CategoryCount = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
};

export type StatusCount = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
};

export type StatusCountByCategory = {
  category: string;
};

export type CategoryCountByStatus = {
  status: string;
};

export type CategoryByServiceYears = {
  category: string;
  serviceYears: string;
  value: number;
  color: string;
};

/* Count Functions */

const countByCategory = (props: DashboardLayoutProps): CategoryCount[] => {
  const { assetData } = props;
  const counts: Record<string, number> = {};

  assetData.forEach((asset) => {
    const category = asset.category;

    if (!counts[category]) {
      counts[category] = 1;
    } else {
      counts[category]++;
    }
  });

  const categoryCount: CategoryCount[] = Object.entries(counts).map(
    ([category, count]) => ({
      id: category,
      label: category,
      value: count,
      percentage: (count / assetData.length) * 100,
      color: '',
    })
  );

  categoryCount.sort((a, b) => b.value - a.value);

  categoryCount.forEach((item, index) => {
    item.color = COLORS[index]?.color || '#8d8d8d';
  });

  return categoryCount;
};

const countByStatus = (
  props: DashboardLayoutProps,
  statusValues: StatusOptions[]
): StatusCount[] => {
  const { assetData } = props;
  const counts: Record<string, number> = {};

  assetData.forEach((asset) => {
    const status = asset.status;

    if (!counts[status]) {
      counts[status] = 1;
    } else {
      counts[status]++;
    }
  });

  const statusCount: StatusCount[] = Object.entries(counts).map(
    ([status, count]) => {
      let color = '';
      const statusOption = statusValues.find(
        (option) => option.value === status
      );
      if (statusOption) {
        color = statusOption.color || '#8d8d8d';
      } else {
        color = '#8d8d8d';
      }

      return {
        id: status,
        label: status,
        value: count,
        percentage: (count / assetData.length) * 100,
        color: color,
      };
    }
  );

  statusCount.sort((a, b) => b.value - a.value);

  return statusCount;
};

const countStatusByCategory = (
  props: DashboardLayoutProps,
  statusValues: StatusOptions[]
): { data: StatusCountByCategory[]; keys: string[] } => {
  const { assetData } = props;
  const counts: Record<string, Record<string, number>> = {};
  const statusOrder: { [key: string]: number } = {
    Deployed: 0,
    'IT Storage': 1,
    Shelved: 2,
    Damaged: 3,
    Unaccounted: 4,
    'For Repair': 5,
  };

  assetData.forEach((asset) => {
    const category = asset.category;
    const status =
      asset.type === 'Hardware' ? (asset as HardwareType).status : undefined;

    if (category !== undefined && status !== undefined) {
      if (!counts[category]) {
        counts[category] = {};
      }

      if (!counts[category][status]) {
        counts[category][status] = 1;
      } else {
        counts[category][status]++;
      }
    }
  });

  Object.keys(counts).forEach((category) => {
    counts[category] = Object.entries(counts[category])
      .sort(([statusA], [statusB]) => {
        const indexA =
          statusOrder[statusA] !== undefined ? statusOrder[statusA] : Infinity;
        const indexB =
          statusOrder[statusB] !== undefined ? statusOrder[statusB] : Infinity;
        return indexA - indexB;
      })
      .reduce((obj, [status, count]) => {
        obj[status] = count;
        return obj;
      }, {} as { [status: string]: number });
  });

  let statuses: string[] = [];
  assetData.forEach((asset) => {
    const status =
      asset.type === 'Hardware' ? (asset as HardwareType).status : undefined;
    if (status && !(status in statusOrder) && !statuses.includes(status)) {
      statuses.push(status);
    }
  });

  statuses = Object.keys(statusOrder).concat(statuses);

  const statusCountByCategory: StatusCountByCategory[] = Object.entries(
    counts
  ).map(([category, status]) => {
    const statusColors: { [status: string]: string } = {};
    Object.keys(status).forEach((stat) => {
      const statusOption = statusValues.find((option) => option.value === stat);
      const color = statusOption ? statusOption.color || '#8d8d8d' : '#8d8d8d'; // Use color from statusValues if available, otherwise default color
      statusColors[stat] = color;
    });
    return {
      category: category,
      ...status,
      ...Object.keys(status).reduce(
        (acc, stat) => ({
          ...acc,
          [`${stat}Color`]: statusColors[stat],
        }),
        {}
      ),
    };
  });

  return { data: statusCountByCategory, keys: statuses };
};

const countCategoryByStatus = (
  props: DashboardLayoutProps,
  colors: { [category: string]: string }
): { data: CategoryCountByStatus[]; keys: string[] } => {
  const { assetData } = props;
  const counts: Record<string, Record<string, number>> = {};

  assetData.forEach((asset) => {
    const status = asset.status;
    const category =
      asset.type === 'Hardware' ? (asset as HardwareType).category : undefined;

    if (status !== undefined && category !== undefined) {
      if (!counts[status]) {
        counts[status] = {};
      }

      if (!counts[status][category]) {
        counts[status][category] = 1;
      } else {
        counts[status][category]++;
      }
    }
  });

  const categories: string[] = [];
  assetData.forEach((asset) => {
    const category =
      asset.type === 'Hardware' ? (asset as HardwareType).category : undefined;
    if (category && !categories.includes(category)) {
      categories.push(category);
    }
  });

  const categoryCountByStatus: CategoryCountByStatus[] = Object.entries(
    counts
  ).map(([status, category]) => {
    const categoryColors: { [status: string]: string } = {};
    Object.keys(category).forEach((cat) => {
      categoryColors[cat] = colors[cat] || '';
    });
    return {
      status: status,
      ...category,
      ...Object.keys(category).reduce(
        (acc, cat) => ({
          ...acc,
          [`${cat}Color`]: categoryColors[cat],
        }),
        {}
      ),
    };
  });

  return { data: categoryCountByStatus, keys: categories };
};

const countCategoryByServiceYears = (
  props: DashboardLayoutProps,
  category: string
): CategoryByServiceYears[] => {
  const { hardwareData } = props;
  const currentDate = new Date();
  const categoryData: { [serviceYears: string]: number } = {};

  hardwareData
    .filter(
      (asset) => asset.category === category && asset.status === 'Deployed'
    )
    .forEach((hardware) => {
      const purchaseDate = new Date(hardware.purchaseDate);
      const serviceYears = Math.floor(
        (currentDate.getTime() - purchaseDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365)
      );

      categoryData[serviceYears.toString()] =
        (categoryData[serviceYears.toString()] || 0) + 1;
    });

  const colorMap: { [serviceYears: string]: string } = {};
  Object.keys(categoryData).forEach((serviceYear, index, array) => {
    colorMap[serviceYear] = interpolateRgbBasis([
      '#377eb8', // blue
      '#4daf4a', // green
      '#ffff33', // yellow
      '#ff7f00', // orange
      '#e41a1c', // red
    ])(index / (array.length - 1));
  });

  const data: CategoryByServiceYears[] = Object.entries(categoryData).map(
    ([serviceYears, count]) => ({
      category: category,
      serviceYears: serviceYears,
      value: count,
      color: colorMap[serviceYears] || '',
    })
  );

  return data;
};

const DashboardLayout = ({ assetData, hardwareData }: DashboardLayoutProps) => {
  const { data: statusValues } = useQuery<StatusOptions[]>({
    queryKey: ['fetchOptionValues', 'status'],
    queryFn: () => imsService.fetchOptionValues('status'),
  });
  const { data: registeredEmployees } = useQuery({
    queryKey: ['fetchEmployees'],
    queryFn: () => imsService.fetchAllEmployees(),
  });
  const { data: assignees } = useQuery<string[]>({
    queryKey: ['fetch', 'assignee'],
    queryFn: () => imsService.fetchAssetUniqueValuesByProperty('assignee'),
  });
  const { data: laptops } = useQuery({
    queryKey: ['fetchAssetsByProperty', 'category', 'Laptop'],
    queryFn: () => imsService.fetchAssetsByProperty('category', 'Laptop'),
  });
  const { data: windowsBundles } = useQuery({
    queryKey: ['fetchAssetsByProperty', 'status', 'Windows Bundle'],
    queryFn: () => imsService.fetchAssetsByProperty('status', 'Windows Bundle'),
  });
  const { data: macbookBundles } = useQuery({
    queryKey: ['fetchAssetsByProperty', 'status', 'MacBook Bundle'],
    queryFn: () => imsService.fetchAssetsByProperty('status', 'MacBook Bundle'),
  });
  const { data: equipmentTypes } = useQuery<string[]>({
    queryKey: ['fetchOptionValues', 'equipmentType'],
    queryFn: () => imsService.fetchOptionValues('equipmentType'),
  });

  const [categoryCount, setCategoryCount] = useState<CategoryCount[]>([]);
  const [statusCount, setStatusCount] = useState<StatusCount[]>([]);
  const [statusCountByCategory, setStatusCountByCategory] = useState<
    StatusCountByCategory[]
  >([]);
  const [statusKeys, setStatusKeys] = useState<string[]>([]);
  const [categoryCountByStatus, setCategoryCountByStatus] = useState<
    CategoryCountByStatus[]
  >([]);
  const [categoryCountByServiceYears, setCategoryCountByServiceYears] =
    useState<CategoryByServiceYears[]>([]);
  const [activeEmployeesCount, setActiveEmployeesCount] = useState<number>(0);
  const [unregisteredEmployeesCount, setUnregisteredEmployeesCount] =
    useState<number>(0);
  const [bundleCountByEquipmentType, setBundleCountByEquipmentType] = useState<
    Record<string, Record<string, number>>
  >({});
  const [assetCountByEquipmentType, setAssetCountByEquipmentType] = useState<
    Record<string, Record<string, Record<string, number>>>
  >({});

  useEffect(() => {
    if (assetData && hardwareData && statusValues) {
      const categoryCount: CategoryCount[] = countByCategory({
        assetData,
        hardwareData,
      });
      const statusCount: StatusCount[] = countByStatus(
        { assetData, hardwareData },
        statusValues
      );
      const { data: statusCountByCategory, keys: statusKeys } =
        countStatusByCategory({ assetData, hardwareData }, statusValues);
      const { data: categoryCountByStatus } = countCategoryByStatus(
        { assetData, hardwareData },
        countByCategory({ assetData, hardwareData }).reduce(
          (acc: { [key: string]: string }, category) => {
            acc[category.label] = category.color;
            return acc;
          },
          {}
        )
      );
      const categoryCountByServiceYears = countCategoryByServiceYears(
        { assetData, hardwareData },
        'Laptop'
      );
      const activeEmployeesCount =
        registeredEmployees?.filter(
          (employee: EmployeeType) => employee.isActive
        ).length || 0;

      const mappedEmpCode = registeredEmployees?.map((f: any) => f['code'])
      const unregisteredEmployeeCount =
        assignees?.reduce((accum: any[], assignee: any) => {
          if(!mappedEmpCode?.includes(assignee)) accum.push(assignee)
          return accum
        }, [])?.length || 0;

      setCategoryCount(categoryCount);
      setStatusCount(statusCount);
      setStatusCountByCategory(statusCountByCategory);
      setStatusKeys(statusKeys);
      setCategoryCountByStatus(categoryCountByStatus);
      setCategoryCountByServiceYears(categoryCountByServiceYears);
      setActiveEmployeesCount(activeEmployeesCount);
      setUnregisteredEmployeesCount(unregisteredEmployeeCount);
    }
  }, [
    assetData,
    assignees,
    hardwareData,
    laptops,
    registeredEmployees,
    statusValues,
  ]);

  useEffect(() => {
    if (equipmentTypes && windowsBundles && macbookBundles) {
      const bundleData: Record<string, Record<string, number>> = {};
      const bundles = [...macbookBundles, ...windowsBundles];

      const keys = equipmentTypes?.reduce(
        (accum: Record<string, number>, value: string) => {
          accum[value] = 0;
          return accum;
        },
        {}
      );

      bundles?.forEach((asset: HardwareType) => {
        const status = asset?.status;
        const equipmentType = asset?.equipmentType;
        if (!bundleData[status]) {
          bundleData[status] = { ...keys, total: 0 };
        }
        bundleData[status][equipmentType]++;
        bundleData[status].total++;
      });

      setBundleCountByEquipmentType(bundleData);
    }
  }, [
    equipmentTypes,
    windowsBundles,
    macbookBundles,
    setBundleCountByEquipmentType,
  ]);

  useEffect(() => {
    if (equipmentTypes && hardwareData) {
      const assetCount: Record<
        string,
        Record<string, Record<string, number>>
      > = {};

      const keys = equipmentTypes?.reduce(
        (accum: Record<string, number>, value: string) => {
          accum[value] = 0;
          return accum;
        },
        {}
      );

      hardwareData?.forEach((asset: HardwareType) => {
        const brand = asset?.brand;
        const category = asset?.category;
        const equipmentType = asset?.equipmentType;
        const status = asset?.status;

        if (
          status === 'IT Storage' &&
          ['Desktop', 'Laptop', 'Mac Mini'].includes(category)
        ) {
          if (!assetCount[status]) {
            assetCount[status] = {
              MacBook: { ...keys, total: 0 },
              Windows: { ...keys, total: 0 },
            };
          }
          if (brand === 'Apple') {
            assetCount[status]['MacBook'][equipmentType]++;
            assetCount[status]['MacBook'].total++;
          } else {
            assetCount[status]['Windows'][equipmentType]++;
            assetCount[status]['Windows'].total++;
          }
        }
      });

      setAssetCountByEquipmentType(assetCount);
    }
  }, [equipmentTypes, hardwareData, setAssetCountByEquipmentType]);

  return (
    <div className="w-full flex flex-col xl:flex-row gap-3 sm:gap-6">
      <div className="w-full flex flex-col gap-3 sm:gap-6">
        <div className="w-full flex flex-col xl:flex-row gap-3 sm:gap-6">
          <div className="w-full flex flex-col gap-3 sm:gap-6">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
              <div
                id="generic metrics"
                className="w-[100%] xl:w-full flex flex-col xl:flex-row gap-3 sm:gap-6"
              >
                <div className="hidden xl:flex gap-3 sm:gap-6 w-full">
                  <div
                    id="hardware assets overview"
                    className="h-fit w-2/4 bg-muted p-3 sm:p-6 rounded-lg drop-shadow flex flex-col gap-3 sm:gap-6"
                  >
                    <div>
                      <h2 className="font-medium text-muted-foreground text-sm">
                        Overview
                      </h2>
                      <h1 className="text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis">
                        Hardware Assets
                      </h1>
                      <Separator className="mt-3 h-[2px]" />
                    </div>
                    <div>
                      <AssetsOverview statusCount={statusCount} />
                    </div>
                  </div>
                  <div
                    id="platforms overview"
                    className="h-fit w-1/4 bg-muted p-3 sm:p-6 rounded-lg drop-shadow flex flex-col gap-3 sm:gap-6"
                  >
                    <div>
                      <h2 className="font-medium text-muted-foreground text-sm">
                        Overview
                      </h2>
                      <h1 className="text-md font-bold text-primary-foreground">
                        Laptop Bundles
                      </h1>
                      <Separator className="mt-3 h-[2px]" />
                    </div>
                    <div>
                      <BundlesOverview
                        windows={
                          bundleCountByEquipmentType['Windows Bundle']?.total
                        }
                        macbooks={
                          bundleCountByEquipmentType['MacBook Bundle']?.total
                        }
                      />
                    </div>
                  </div>
                  <div
                    id="employees overview"
                    className="h-fit w-1/4 bg-muted p-3 sm:p-6 rounded-lg drop-shadow flex flex-col gap-3 sm:gap-6"
                  >
                    <div>
                      <h2 className="font-medium text-muted-foreground text-sm">
                        Overview
                      </h2>
                      <h1 className="text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis">
                        Employees
                      </h1>
                      <Separator className="mt-3 h-[2px]" />
                    </div>
                    <div>
                      <EmployeesOverview
                        activeEmployees={activeEmployeesCount}
                        unregisteredEmployees={unregisteredEmployeesCount}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid xl:hidden grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  <div
                    id="hardware assets overview"
                    className="h-fit col-span-1 sm:col-span-2 bg-muted p-3 sm:p-6 rounded-lg drop-shadow flex flex-col gap-3 sm:gap-6"
                  >
                    <div>
                      <h2 className="font-medium text-muted-foreground text-sm">
                        Overview
                      </h2>
                      <h1 className="text-md font-bold text-primary-foreground">
                        Hardware Assets
                      </h1>
                      <Separator className="mt-3 h-[2px]" />
                    </div>
                    <div>
                      <AssetsOverview statusCount={statusCount} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-6">
                    <div
                      id="platforms overview"
                      className="h-fit bg-muted p-3 sm:p-6 rounded-lg drop-shadow flex flex-col gap-3 sm:gap-6"
                    >
                      <div>
                        <h2 className="font-medium text-muted-foreground text-sm">
                          Overview
                        </h2>
                        <h1 className="text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis">
                          Laptop Bundles
                        </h1>
                        <Separator className="mt-3 h-[2px]" />
                      </div>
                      <div>
                        <BundlesOverview
                          windows={
                            bundleCountByEquipmentType['Windows Bundle']?.total
                          }
                          macbooks={
                            bundleCountByEquipmentType['MacBook Bundle']?.total
                          }
                        />
                      </div>
                    </div>
                    <div
                      id="employees overview"
                      className="h-fit bg-muted p-3 sm:p-6 rounded-lg drop-shadow flex flex-col gap-3 sm:gap-6"
                    >
                      <div>
                        <h2 className="font-medium text-muted-foreground text-sm">
                          Overview
                        </h2>
                        <h1 className="text-md font-bold text-primary-foreground">
                          Employees
                        </h1>
                        <Separator className="mt-3 h-[2px]" />
                      </div>
                      <div>
                        <EmployeesOverview
                          activeEmployees={activeEmployeesCount}
                          unregisteredEmployees={unregisteredEmployeesCount}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    id="hardware asset distribution"
                    className="w-[100%] bg-muted rounded-lg p-3 sm:p-6 flex xl:hidden flex-col gap-2 drop-shadow"
                  >
                    <div>
                      <h2 className="font-medium text-muted-foreground text-sm">
                        Statistics
                      </h2>
                      <h1 className="text-md font-bold text-primary-foreground">
                        Hardware asset distribution
                      </h1>
                      <Separator className="mt-3 h-[2px]" />
                    </div>
                    <div className="h-[300px]">
                      <HardwareDistPie data={categoryCount} />
                    </div>
                    <HardwareDistLegend categoryCount={categoryCount} />
                  </div>
                </div>
              </div>
            </div>
            <div
              id="status by category"
              className="w-full bg-muted rounded-lg p-3 sm:p-6 flex flex-col gap-2 drop-shadow"
            >
              <div>
                <h2 className="font-medium text-muted-foreground text-sm">
                  Statistics
                </h2>
                <h1 className="text-md font-bold text-primary-foreground">
                  Status by category
                </h1>
                <Separator className="mt-3 h-[2px]" />
              </div>
              <div className="flex gap-4">
                <div className="h-[300px] w-[100%] md:w-[70%]">
                  <StatusByCategoryBar
                    data={statusCountByCategory}
                    keys={statusKeys}
                  />
                </div>
                <div className="w-[30%] hidden md:flex flex-col justify-end whitespace-nowrap self-end">
                  <StatusByCategoryLegend
                    statusCount={statusCount}
                    categoryCountByStatus={categoryCountByStatus}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            id="hardware asset distribution"
            className="w-[35%] bg-muted rounded-lg p-3 sm:p-6 hidden xl:flex flex-col gap-2 drop-shadow"
          >
            <div>
              <h2 className="font-medium text-muted-foreground text-sm">
                Statistics
              </h2>
              <h1 className="text-md font-bold text-primary-foreground">
                Hardware asset distribution
              </h1>
              <Separator className="mt-3 h-[2px]" />
            </div>
            <div className="h-[300px]">
              <HardwareDistPie data={categoryCount} />
            </div>
            <HardwareDistLegend categoryCount={categoryCount} />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-6">
          <div
            id="laptop service years"
            className="w-full xl:w-1/3 h-fit bg-muted rounded-lg p-3 sm:p-6 flex flex-col gap-2 drop-shadow"
          >
            <div>
              <h2 className="font-medium text-muted-foreground text-sm">
                Statistics
              </h2>
              <h1 className="text-md font-bold text-primary-foreground">
                Deployed laptop service years
              </h1>
              <Separator className="mt-3 h-[2px]" />
            </div>
            <div className="h-[280px]">
              <LaptopServiceYearsBar data={categoryCountByServiceYears} />
            </div>
          </div>
          <div
            id="latest assets added"
            className="w-full xl:w-2/3 h-full bg-muted rounded-lg p-3 sm:p-6 flex flex-col gap-0 drop-shadow"
          >
            <div>
              <h2 className="font-medium text-muted-foreground text-sm">
                Activity
              </h2>
              <h1 className="text-md font-bold text-primary-foreground">
                Latest assets added
              </h1>
              <Separator className="mt-3 h-[2px]" />
            </div>
            {assetData ? (
              <LatestAssetsTable data={assetData.slice(-5)} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-6">
          <div className="w-full xl:w-1/2 h-full bg-muted rounded-lg p-3 sm:p-6 flex flex-col gap-0 drop-shadow">
            <div>
              <h2 className="font-medium text-muted-foreground text-sm">
                Hardware Asset
              </h2>
              <h1 className="text-md font-bold text-primary-foreground">
                Equipment Bundles
              </h1>
              <Separator className="mt-3 h-[2px]" />
              <AssetTypeDistribution
                title="Equipment Bundles"
                equipmentTypes={equipmentTypes}
                data={bundleCountByEquipmentType}
              />
            </div>
          </div>
          <div className="w-full xl:w-1/2 h-full bg-muted rounded-lg p-3 sm:p-6 flex flex-col gap-0 drop-shadow">
            <div>
              <h2 className="font-medium text-muted-foreground text-sm">
                Hardware Asset
              </h2>
              <h1 className="text-md font-bold text-primary-foreground">
                IT Storage
              </h1>
              <Separator className="mt-3 h-[2px]" />
              <AssetTypeDistribution
                title="IT Storage"
                equipmentTypes={equipmentTypes}
                data={assetCountByEquipmentType['IT Storage']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout