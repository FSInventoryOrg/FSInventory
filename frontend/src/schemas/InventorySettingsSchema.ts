import { z } from 'zod';

export const InventorySettingsSchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  equipmentType: z.string().optional(),
  deployableStatus: z.string().optional(),
  retrievableStatus: z.string().optional(),
  inventoryColumns: z.array(z.string()).optional(),
}).refine(data => data.deployableStatus !== data.retrievableStatus, {
  message: "Status for deployable assets and retrievable assets must not be the same",
  path: ["deployableStatus"],
}).refine(data => data.deployableStatus !== data.retrievableStatus, {
  message: "Status for deployable assets and retrievable assets must not be the same",
  path: ["retrievableStatus"],
});

export type InventorySettingsFormData = z.infer<typeof InventorySettingsSchema>;
