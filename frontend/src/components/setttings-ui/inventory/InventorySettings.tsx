import * as imsService from '@/ims-service'
import { Defaults } from "@/types/options"
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/Spinner';
import InventorySettingsForm from './InventorySettingsForm';

const InventorySettings = () => {

  const { data: defaults } = useQuery<Defaults>({ 
    queryKey: ['fetchOptionValues', 'defaults'], 
    queryFn: () => imsService.fetchOptionValues('defaults'),
  });

  if (!defaults) {
    return (
      <div className="w-full flex justify-center items-center" style={{ height: 'calc(100vh - 89px)' }}><Spinner /></div>
    )
  }

  return (
    <div className="md:w-5/6 flex flex-col max-w-4xl" >
      <InventorySettingsForm defaults={defaults} />
    </div>
  )
}

export default InventorySettings