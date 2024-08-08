import { z } from 'zod';

export const InventorySettingsSchema = z.object({
  status: z.string().trim().optional(),
  category: z.string().trim().optional(),
  equipmentType: z.string().trim().optional(),
  deployableStatus: z.string().trim().optional(),
  retrievableStatus: z.string().trim().optional(),
  inventoryColumns: z.array(z.string().trim()).optional(),
});

export type InventorySettingsFormData = z.infer<typeof InventorySettingsSchema>;
