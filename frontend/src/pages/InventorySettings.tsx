import * as imsService from '@/ims-service'
import { Defaults } from "@/types/options"
import SettingsForm from "@/components/inventory-ui/SettingsForm"
import { useQuery } from '@tanstack/react-query';

const DEFAULTS = {
  status: '',
  category: '',
  equipmentType: '',
  deployableStatus: '',
  retrievableStatus: '',
  inventoryColumns: ['']
}

const InventorySettings = () => {

  const { data: defaults } = useQuery<Defaults>({ 
    queryKey: ['fetchOptionValues', 'defaults'], 
    queryFn: () => imsService.fetchOptionValues('defaults'),
  });

  return (
    <section id="edit inventory" className="container mx-auto w-full max-w-4xl py-6 px-6" >
      <SettingsForm defaults={defaults || DEFAULTS} />
    </section>
  )
}

export default InventorySettings