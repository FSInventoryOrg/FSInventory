import { z } from 'zod';

export const InventorySettingsSchema = z.object({
  status: z.string().trim().optional(),
  softwareCategory: z.string().trim().optional(),
  hardwareCategory: z.string().trim().optional(),
  equipmentType: z.string().trim().optional(),
  deployableStatus: z.array(z.string()).min(1, 'Select at least 1 deployable status'),
  retrievableStatus: z.string().trim(),
  inventoryColumns: z.array(z.string().trim()).optional(),
});

export type InventorySettingsFormData = z.infer<typeof InventorySettingsSchema>;
