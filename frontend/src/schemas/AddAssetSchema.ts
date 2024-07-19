import { z } from 'zod';

export const AssetSchema = z.object({
  type: z.enum(["Hardware", "Software"]),
  code: z.string().optional(),
  category: z.string().min(1, "Select an asset category"),
  brand: z.string().optional(),
  modelName: z.string().optional(),
  modelNo: z.string().optional(),
  serialNo: z.string().optional(),
  processor: z.string().optional(),
  memory: z.string().optional(),
  storage: z.string().optional(),
  status: z.string().min(1, "Asset status is required"),
  assignee: z.string().optional(),
  purchaseDate: z.date().nullable().optional(),
  // serviceInYears: z.number().optional(),
  supplierVendor: z.string().optional(),
  pezaForm8105: z.string().optional(),
  pezaForm8106: z.string().optional(),
  isRGE: z.boolean().optional(),
  equipmentType: z.string().min(1, "Equipment type is required"),
  remarks: z.string().optional(),
  deploymentDate: z.date().nullable().optional(),
  recoveredFrom: z.string().optional(),
  recoveryDate: z.date().nullable().optional(),
  client: z.string().optional(),
  license: z.string().optional(),
  version: z.string().optional(),
});

export type AssetFormData = z.infer<typeof AssetSchema>;
