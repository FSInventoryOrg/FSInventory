import { Separator } from "@/components/ui/separator"
import TagSelect from "./TagSelect";

const VisibleColumnsForm = ({ onTagSelect }: { onTagSelect: (tags: string[]) => void }) => {

  return (
    <div className='w-full'>
      <div className='pb-2'>
        <h1 className='text-xl font-semibold'>Column visibility</h1>
        <h3 className='text-accent-foreground'>Determines the default asset properties to show as columns in the inventory table.</h3>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <TagSelect onTagSelect={onTagSelect} defaults={true} property="defaults" size="lg" />
      </div>
      <Separator className="my-4" />
    </div>
  )
}

export default VisibleColumnsForm;