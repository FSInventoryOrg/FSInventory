import { z } from 'zod';

export const InventorySettingsSchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  equipmentType: z.string().optional(),
  deployableStatus: z.string().optional(),
  retrievableStatus: z.string().optional(),
  inventoryColumns: z.array(z.string()).optional(),
}).refine(data => {
  if (data.deployableStatus !== '-' && data.retrievableStatus !== '-') {
    return data.deployableStatus !== data.retrievableStatus;
  }
  return true;
}, {
  message: "Status for deployable assets and retrievable assets must not be the same",
  path: ["deployableStatus"],
}).refine(data => {
  if (data.deployableStatus !== '-' && data.retrievableStatus !== '-') {
    return data.retrievableStatus !== data.retrievableStatus;
  }
  return true;
}, {
  message: "Status for deployable assets and retrievable assets must not be the same",
  path: ["retrievableStatus"],
});

export type InventorySettingsFormData = z.infer<typeof InventorySettingsSchema>;
