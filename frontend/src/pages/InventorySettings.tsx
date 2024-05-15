import * as imsService from '@/ims-service'
import { Defaults } from "@/types/options"
import SettingsForm from "@/components/inventory-ui/SettingsForm"
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/Spinner';

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
    <section id="edit inventory" className="container mx-auto w-full max-w-4xl py-6 px-6" >
      <SettingsForm defaults={defaults} />
    </section>
  )
}

export default InventorySettings