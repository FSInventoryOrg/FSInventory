import { z } from 'zod';

export const InventorySettingsSchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  equipmentType: z.string().optional(),
  deployableStatus: z.string().optional(),
  retrievableStatus: z.string().optional(),
  inventoryColumns: z.array(z.string()).optional(),
});

export type InventorySettingsFormData = z.infer<typeof InventorySettingsSchema>;
