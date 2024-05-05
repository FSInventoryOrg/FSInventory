import { HardwareType } from '@/types/asset'
import { CalendarDaysIcon, CircleUserIcon, ClockIcon, CreditCardIcon, InfoIcon, LibraryBig, NotebookPenIcon, ScaleIcon, SettingsIcon } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StatusBadge from './StatusBadge';
import DeployAsset from './DeployAsset';
import RetrieveAsset from './RetrieveAsset';
import DeploymentDuration from '../tracker-ui/DeploymentDuration';
import Empty from '../graphics/Empty';

interface AssetDetailsProps {
  asset: HardwareType;
}

interface Field {
  label: string;
  value: string;
}

function calculateDuration(diffInMs: number): string {
  // Convert milliseconds to days, hours, minutes, and seconds
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  // Construct the duration string
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const renderSection = (title: string, fields: Field[], icon: React.ReactNode) => (
  <div className='flex flex-col gap-1 text-sm border-t mt-4'>
    <h1 className='static -translate-y-3 translate-x-3 bg-card px-1 text-secondary-foreground flex items-center gap-1.5 w-fit'>
      {icon}
      {title}
    </h1>
    {fields.map((field, index) => (
      <div key={index} className='flex gap-2 -translate-y-3 px-2'>
        <span className='whitespace-nowrap font-extralight text-accent-foreground w-1/2 text-end'>{field.label}</span>
        <span className='w-full text-start'>{field.value}</span>
      </div>
    ))}
  </div>
);

const AssetDetails = ({ asset }: AssetDetailsProps) => {

  const generalInfo: Field[] = [
    { label: 'Code:', value: asset.code },
    { label: 'Type:', value: asset.type },
    { label: 'Status:', value: asset.status },
    { label: 'Category:', value: asset.category },
    { label: 'Brand:', value: asset.brand },
    { label: 'Model Name:', value: asset.modelName },
    { label: 'Model Number:', value: asset.modelNo },
    { label: 'Serial Number:', value: asset.serialNo }
  ];

  const systemSpecs: Field[] = [
    { label: 'Processor:', value: asset.processor },
    { label: 'Memory:', value: asset.memory },
    { label: 'Storage:', value: asset.storage }
  ];

  const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
  const currentDate = new Date();
  
  const yearsOfService = purchaseDate ? Math.floor((currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toString() : '';
  
  const purchaseDetails: Field[] = [
      { label: 'Date of Purchase:', value: purchaseDate ? purchaseDate.toDateString() : '' },
      { label: 'Years of Service:', value: yearsOfService },
      { label: 'Supplier/Vendor:', value: asset.supplierVendor }
  ];

  const legalInfo: Field[] = [
    { label: 'PEZA Form 8105:', value: asset.pezaForm8105 },
    { label: 'PEZA Form 8106:', value: asset.pezaForm8105 },
    { label: 'Is RGE:', value: asset.isRGE ? 'YES' : 'NO' }
  ]

  const otherInfo: Field[] = [
    { label: 'Equipment Type:', value: asset.equipmentType },
    { label: 'From Client:', value: asset.client },
    { label: 'Assigned To:', value: asset.assignee },
    { label: 'Deployment Date:', value: asset.deploymentDate ? new Date(asset.deploymentDate).toLocaleString() : '' },
    { label: 'Recovered From:', value: asset.recoveredFrom },
    { label: 'Date of Recovery:', value: asset.recoveryDate ? new Date(asset.recoveryDate).toLocaleString() : ''},
  ]

  const dateCreated = asset.created ? new Date(asset.created) : null;
  const dateUpdated = asset.updated ? new Date(asset.updated) : null;

  return (
    <div className='pt-4'>
      <div className='flex justify-between'>
        <div className='text-sm w-fit bg-accent text-accent-foreground font-semibold border-border border rounded-full px-2.5 py-1 flex items-center gap-2'>
          <StatusBadge status={asset.status} />
        </div>
        {asset.status === 'Deployed' && <RetrieveAsset assetData={asset} />}
        {asset.status === 'IT Storage' && <DeployAsset assetData={asset} />}
      </div>
      <div className='text-muted-foreground flex flex-col pt-2'>
        <div className='italic text-xs'>
          Asset added on&nbsp;
          <span className=''>
            {dateCreated ? dateCreated.toLocaleString() : ''}
          </span>
          {asset.createdBy && (
            <span>&nbsp;by {asset.createdBy}.</span>
          )}
        </div>
        {dateUpdated && dateCreated && dateUpdated.getTime() !== dateCreated.getTime() && (
          <div className='text-sm'>
            <span className='font-bold'>
              Last updated:&nbsp;
            </span>
            <span className='underline underline-offset-2'>
              {dateUpdated.toLocaleString()}
              {asset.updatedBy && (
                <span>&nbsp;by {asset.updatedBy}.</span>
              )}
            </span>
          </div>
        )}
      </div>
      <Tabs defaultValue="details" className="w-full pt-4">
        <TabsList className='w-full'>
          <TabsTrigger value="details" className='w-full'>Details</TabsTrigger>
          <TabsTrigger value="history" className='w-full'>History</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <ScrollArea className='flex flex-col gap-4 h-[500px] pt-3'>
            {renderSection('General Information', generalInfo, <InfoIcon size={16} className='text-primary' />)}
            {renderSection('System Specifications', systemSpecs, <SettingsIcon size={16} className='text-primary' />)}
            {renderSection('Purchase Details', purchaseDetails, <CreditCardIcon size={16} className='text-primary' />)}
            {renderSection('Legal Information', legalInfo, <ScaleIcon size={16} className='text-primary' />)}
            {renderSection('Miscellaneous', otherInfo, <LibraryBig size={16} className='text-primary' />)}
            <div className='flex flex-col gap-1 text-sm border-t mt-4'>
              <h1 className='static -translate-y-3 translate-x-3 bg-background px-1 text-secondary-foreground flex items-center gap-1.5 w-fit'>
                <NotebookPenIcon size={16} className='text-primary' />
                Remarks
              </h1>
              <span className='border rounded-md p-2 min-h-20 bg-muted'>
                {asset.remarks}
              </span>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="history">
          {(asset.deploymentHistory.length !== 0) ? (
            <ScrollArea className='flex flex-col gap-4 h-[500px] pt-3'>
              {asset.deploymentHistory.map((record, index) => {
                const deploymentDateObj = record.deploymentDate ? new Date(record.deploymentDate) : null;
                const recoveryDateObj = record.recoveryDate ? new Date(record.recoveryDate) : null;

                const diffInMs = recoveryDateObj ? recoveryDateObj.getTime() - (deploymentDateObj?.getTime() ?? 0) : null;

                // Calculate duration if recoveryDate is defined, otherwise set duration as null
                const duration = diffInMs !== null ? calculateDuration(diffInMs) : null;

                return (
                  <div key={index} className='flex flex-col gap-1 text-sm border-t py-2'>
                    {/* Render assignee */}
                    <div className='flex gap-2 px-2 mb-2'>
                      <span className='whitespace-nowrap text-primary flex justify-center items-center'><CircleUserIcon size={24} /></span>
                      <div className='w-full flex gap-2 text-base items-center'>
                        {record.assignee}
                      </div>
                      <span className='w-fit'></span>
                    </div>
                    {/* Render deployment and recovery dates */}
                    <div className='flex gap-2 px-2'>
                      <span className='whitespace-nowrap text-accent-foreground flex justify-center items-center'><CalendarDaysIcon size={16} /></span>
                      <div className='w-full flex gap-2 text-sm text-accent-foreground'>
                        <span>{deploymentDateObj ? deploymentDateObj.toLocaleString() : ''}</span>
                        -
                        <span>{recoveryDateObj ? recoveryDateObj.toLocaleString() : 'Present'}</span> {/* Display "Present" if recoveryDate is undefined */}
                      </div>
                      <span className='w-fit'></span>
                    </div>
                    {/* Render duration if recoveryDate is defined */}
                    {duration ? 
                      <div className='flex gap-2 px-2'>
                        <span className='whitespace-nowrap text-accent-foreground flex justify-center items-center'><ClockIcon size={16} /></span>
                        <div className='w-full flex gap-2 text-sm text-accent-foreground'>
                          <span>{duration}</span>
                        </div>
                        <span className='w-fit'></span>
                      </div>
                      : 
                      <div className='flex gap-2 px-2'>
                        <span className='whitespace-nowrap text-accent-foreground flex justify-center items-center'><ClockIcon size={16} /></span>
                        <div className='w-full flex gap-2 text-sm text-accent-foreground'>
                          <span>                      
                            <DeploymentDuration deploymentDate={record.deploymentDate} />
                          </span>
                        </div>
                        <span className='w-fit'></span>
                      </div>
                    }
                  </div>
                );
              })}
            </ScrollArea>
          ) : (
            <div className='h-[500px] flex flex-col items-center justify-center'>
              <Empty height={200} width={400} />
              <span className="text-muted-foreground text-sm">No results found</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetails