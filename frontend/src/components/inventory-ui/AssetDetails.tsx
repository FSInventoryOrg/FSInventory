import { AssetUnionType,   DeploymentHistory, HardwareType, SoftwareType } from '@/types/asset'
import { CreditCardIcon, InfoIcon, LibraryBig, NotebookPenIcon, ScaleIcon, SettingsIcon, TrashIcon, 
  CodeIcon } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as imsService from '@/ims-service'
import StatusBadge from './StatusBadge';
import DeployAsset from './DeployAsset';
import RetrieveAsset from './RetrieveAsset';
import DeploymentDuration from '../tracker-ui/DeploymentDuration';
import Empty from '../graphics/Empty';
import { UserIcon } from '../icons/UserIcon';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface AssetDetailsProps {
  asset: AssetUnionType;
  onRetrieve?: () => void;
}

interface Field {
  label: string;
  value: string;
  type?: string;
}

const isHardware = (asset: AssetUnionType): asset is HardwareType =>
  asset.type === 'Hardware';
const isSoftware = (asset: AssetUnionType): asset is SoftwareType =>
  asset.type === 'Software';

function calculateDuration(diffInMs: number): string {
  // Convert milliseconds to days, hours, minutes, and seconds
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  // Construct the duration string
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const renderSection = (
  title: string,
  fields: Field[],
  icon: React.ReactNode
) => (
  <div className='flex flex-col gap-1 text-sm border-t mt-4'>
    <h1 className='static -translate-y-3 translate-x-3 bg-card px-1 text-secondary-foreground flex items-center gap-1.5 w-fit'>
      {icon}
      {title}
    </h1>
    {fields.map((field, index) => (
      <div key={index} className='flex gap-2 -translate-y-3 px-2'>
        <span className='whitespace-nowrap font-extralight text-accent-foreground w-1/2 text-end'>
          {field.label}
        </span>
        <span className='w-full text-start'>{field.value}</span>
      </div>
    ))}
  </div>
);

const AssetDetails = ({ asset, onRetrieve }: AssetDetailsProps) => {
  const queryClient = useQueryClient();

  const handleRemoveDeployment = async (index: number) => {
    console.log(asset.code, index);
    await imsService.removeDeploymentHistoryEntry(asset.code, index);
    queryClient.invalidateQueries({ queryKey: ['fetchAllAssets'] });
    queryClient.invalidateQueries({ queryKey: ['fetchAssetsByProperty'] });
    queryClient.invalidateQueries({
      queryKey: ['fetchAllAssetsByStatusAndCategory'],
    });
    queryClient.invalidateQueries({ queryKey: ['fetchEmployees'] });
    queryClient.invalidateQueries({ queryKey: ['fetchEmployeeByCode'] });
  };

  const generalInfo: Field[] = [
    { label: 'Code:', value: asset.code },
    { label: 'Type:', value: asset.type },
    { label: 'Status:', value: asset.status },
    { label: 'Category:', value: asset.category },
    ...(isHardware(asset)
      ? [
          { label: 'Brand:', value: asset.brand, type: 'Hardware' },
          { label: 'Model Name:', value: asset.modelName, type: 'Hardware' },
          { label: 'Model Number:', value: asset.modelNo, type: 'Hardware' },
          { label: 'Serial Number:', value: asset.serialNo, type: 'Hardware' },
        ]
      : []),
    ...(isSoftware(asset)
      ? [
          {
            label: 'License Key/Serial Number:',
            value: asset.serialNo,
            type: 'Software',
          },
        ]
      : []),
  ];

  const systemSpecs: Field[] = [
    { label: 'Processor:', value: "processor" in asset ? asset.processor: '' },
    { label: 'Memory:', value: "memory" in asset ? asset.memory: '' },
    { label: 'Storage:', value: "storage" in asset ? asset.storage: '' }
  ];

  const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
  const currentDate = new Date();

  const yearsOfService = purchaseDate
    ? Math.floor(
        (currentDate.getTime() - purchaseDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      ).toString()
    : '';

  const purchaseDetails: Field[] = [
      { label: 'Supplier/Vendor:', value: "supplierVendor" in asset ? asset.supplierVendor: "vendor" in asset ? asset.vendor : '' },
      { label: 'Date of Purchase:', value: purchaseDate ? purchaseDate.toDateString() : '' },
      { label: 'Years of Service:', value: yearsOfService }
  ];

  const legalInfo: Field[] = [
    { label: 'PEZA Form 8105:', value: "pezaForm8105" in asset? asset.pezaForm8105: '' },
    { label: 'PEZA Form 8106:', value: "pezaForm8105" in asset? asset.pezaForm8105: '' },
    { label: 'Is RGE:', value: "isRGE" in asset ? (asset.isRGE ? 'YES' : 'NO'): '' }
  ]

  const softwareDetails: Field[] = [
    {
      label: 'License Type:',
      value: 'licenseType' in asset ? asset.licenseType : '',
    },
    {
      label: 'License Expiration Date:',
      value:
        'licenseExpirationDate' in asset
          ? asset.licenseExpirationDate
            ? new Date(asset.licenseExpirationDate).toLocaleString()
            : ''
          : '',
    },
    {
      label: 'License Cost:',
      value: 'licenseCost' in asset ? `₱${asset.licenseCost ?? 0}` : '',
    },
    {
      label: 'Number of License:',
      value: 'noOfLicense' in asset ? asset.noOfLicense?.toString() : '',
    },
    {
      label: 'Installation Path:',
      value: 'installationPath' in asset ? asset.installationPath : '',
    },
  ]
  
  const otherInfo: Field[] = [
    ...(isHardware(asset)
      ? [
          { label: 'Equipment Type:', value: asset.equipmentType },
          { label: 'From Client:', value: asset.client },
        ]
      : []),
    {
      label: 'Assigned To:',
      value: asset._addonData_assignee || asset.assignee,
    },
    {
      label: 'Deployment Date:',
      value: asset.deploymentDate
        ? new Date(asset.deploymentDate).toLocaleString()
        : '',
    },
    {
      label: 'Recovered From:',
      value: asset._addonData_recoveredFrom || asset.recoveredFrom,
    },
    {
      label: 'Date of Recovery:',
      value: asset.recoveryDate
        ? new Date(asset.recoveryDate).toLocaleString()
        : '',
    },
  ];

  const dateCreated = asset.created ? new Date(asset.created) : null;
  const dateUpdated = asset.updated ? new Date(asset.updated) : null;

  return (
    <div className=''>
      <div className='flex justify-between'>
        <div className='text-sm w-fit bg-accent text-accent-foreground font-semibold border-border border rounded-full px-2.5 py-1 flex items-center gap-2'>
          <StatusBadge status={asset.status} />
        </div>
        {asset.status === 'Deployed' && (
          <RetrieveAsset assetData={asset} onRetrieve={onRetrieve} />
        )}
        {asset.status === 'IT Storage' && <DeployAsset assetData={asset} />}
      </div>
      <div className='text-muted-foreground flex flex-col pt-2'>
        <div className='italic text-xs'>
          Asset added on&nbsp;
          <span className=''>
            {dateCreated ? dateCreated.toLocaleString() : ''}
          </span>
          {asset.createdBy && <span>&nbsp;by {asset.createdBy}.</span>}
        </div>
        {dateUpdated &&
          dateCreated &&
          dateUpdated.getTime() !== dateCreated.getTime() && (
            <div className='text-sm'>
              <span className='font-bold'>Last updated:&nbsp;</span>
              <span className='underline underline-offset-2'>
                {dateUpdated.toLocaleString()}
                {asset.updatedBy && <span>&nbsp;by {asset.updatedBy}.</span>}
              </span>
            </div>
          )}
      </div>
      <Tabs defaultValue='details' className='w-full pt-4'>
        <TabsList className='w-full'>
          <TabsTrigger value='details' className='w-full'>
            Details
          </TabsTrigger>
          <TabsTrigger value='history' className='w-full'>
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent tabIndex={-1} value='details'>
          <ScrollArea className='flex flex-col gap-4 h-[350px] pt-3'>
            {renderSection(
              'General Information',
              generalInfo,
              <InfoIcon size={16} className='text-primary' />
            )}
            {isHardware(asset) &&
              renderSection(
                'System Specifications',
                systemSpecs,
                <SettingsIcon size={16} className='text-primary' />
              )}
            {isSoftware(asset) &&
              renderSection(
                'Software Details',
                softwareDetails,
                <CodeIcon size={16} className='text-primary' />
              )}
            {renderSection(
              'Purchase Details',
              purchaseDetails,
              <CreditCardIcon size={16} className='text-primary' />
            )}
            {isHardware(asset) &&
              renderSection(
                'Legal Information',
                legalInfo,
                <ScaleIcon size={16} className='text-primary' />
              )}
            {renderSection(
              'Miscellaneous',
              otherInfo,
              <LibraryBig size={16} className='text-primary' />
            )}
            <div className='flex flex-col gap-1 text-sm border-t mt-4'>
              <h1 className='static -translate-y-3 translate-x-3 bg-background px-1 text-secondary-foreground flex items-center gap-1.5 w-fit'>
                <NotebookPenIcon size={16} className='text-primary' />
                Remarks
              </h1>
              <span className="pt-2 pl-2">
                {asset.remarks}
              </span>
              <span className='pb-2 pl-2 font-extralight text-accent-foreground text-xs text-start italic'>{format(asset.updated, "PP")}</span>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value='history'>
          {asset.deploymentHistory.length !== 0 ? (
            <ScrollArea className='flex flex-col gap-4 h-[350px] pt-3'>
              {asset.deploymentHistory.map(
                (record: DeploymentHistory, index) => {
                  const deploymentDateObj = record.deploymentDate
                    ? new Date(record.deploymentDate)
                    : null;
                  const recoveryDateObj = record.recoveryDate
                    ? new Date(record.recoveryDate)
                    : null;

                  const diffInMs =
                    recoveryDateObj && deploymentDateObj
                      ? recoveryDateObj.getTime() -
                        (deploymentDateObj?.getTime() ?? 0)
                      : null;

                  // Calculate duration if recoveryDate is defined, otherwise set duration as null
                  const duration =
                    diffInMs !== null ? calculateDuration(diffInMs) : null;

                  return (
                    <div
                      key={index}
                      className='relative flex flex-row gap-2 text-sm border-t py-4'
                    >
                      <Button
                        size='icon'
                        className='absolute top-2 right-2 text-destructive flex justify-center items-center rounded-full h-8 w-8 sm:h-8 sm:w-8 bg-transparent hover:bg-destructive/20 border-0'
                        onClick={() => handleRemoveDeployment(index)}
                      >
                        <TrashIcon size={16} />
                      </Button>
                      <div className='h-14 w-14 bg-muted rounded-full justify-center items-center flex'>
                        <UserIcon
                          size={55}
                          className='fill-current text-secondary'
                        />
                      </div>
                      <div className=''>
                        {/* Render assignee */}
                        <div className='flex gap-2 px-2'>
                          <div className='w-full flex gap-2 text-sm items-center font-bold uppercase'>
                            {record?._addonData_assignee || record.assignee}
                          </div>
                          <span className='w-fit'></span>
                        </div>
                        {/* Render deployment and recovery dates */}
                        <div className='flex gap-2 px-2'>
                          <div className='w-full flex gap-2 text-xs text-accent-foreground'>
                            <span>
                              {deploymentDateObj
                                ? deploymentDateObj.toDateString()
                                : 'null'}
                            </span>
                            -
                            <span>
                              {recoveryDateObj
                                ? recoveryDateObj.toDateString()
                                : 'Present'}
                            </span>{' '}
                            {/* Display "Present" if recoveryDate is undefined */}
                          </div>
                          <span className='w-fit'></span>
                        </div>
                        {/* Render duration if recoveryDate is defined */}
                        {duration ? (
                          <div className='flex gap-2 px-2'>
                            <div className='w-full flex gap-2 text-xs text-accent-foreground'>
                              <span>{duration}</span>
                            </div>
                            <span className='w-fit'></span>
                          </div>
                        ) : (
                          <div className='flex gap-2 px-2'>
                            <div className='w-full flex gap-2 text-xs text-accent-foreground'>
                              <span>
                                <DeploymentDuration
                                  deploymentDate={record.deploymentDate}
                                />
                              </span>
                            </div>
                            <span className='w-fit'></span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </ScrollArea>
          ) : (
            <div className='h-[350px] flex flex-col items-center justify-center'>
              <Empty height={200} width={400} />
              <span className='text-muted-foreground text-sm'>
                No results found
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetails;
