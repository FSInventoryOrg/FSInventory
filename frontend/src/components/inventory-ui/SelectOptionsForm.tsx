
import { Separator } from "@/components/ui/separator"
import EditOptions from "./EditOptions";
import { Label } from "../ui/label";

const SelectOptionsForm = () => {
  
  return (
    <div className='w-full'>
      <div className='pb-2'>
        <h1 className='text-xl font-semibold'>Default values</h1>
        <h3 className='text-accent-foreground'>Select default values for asset properties with options.</h3>
      </div>
      <div className="pb-2 flex flex-col gap-3 my-2">
        <Label className="font-medium">Status</Label>
        <div className="w-2/3">
          <EditOptions colorSelect={true} property='status' className='w-full' />
        </div>
      </div>
      <div className="pb-2 flex flex-col gap-3 my-2">
        <Label className="font-medium">Category</Label>
        <div className="w-2/3">
          <EditOptions tagSelect={true} property='category' className='w-full' />
        </div>
      </div>
      <div className="pb-2 flex flex-col gap-3 my-2">
        <Label className="font-medium">Equipment type</Label>
        <div className="w-2/3">
          <EditOptions property='equipmentType' className='w-full' />
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  )
}

export default SelectOptionsForm;