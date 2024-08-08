import { z } from 'zod';

export const AssetSchema = z.object({
  type: z.enum(['Hardware', 'Software']),
  code: z.string().trim().optional(),
  category: z.string().trim().min(1, 'Asset category is required'),
  brand: z.string().trim().optional(),
  modelName: z.string().trim().optional(),
  modelNo: z.string().trim().optional(),
  serialNo: z.string().trim().min(1, 'Serial number is required'),
  processor: z.string().trim().optional(),
  memory: z.string().trim().optional(),
  storage: z.string().trim().optional(),
  status: z.string().trim().min(1, 'Asset status is required'),
  assignee: z.string().trim().optional(),
  purchaseDate: z.date().nullable().optional(),
  // serviceInYears: z.number().optional(),
  supplierVendor: z.string().trim().optional(),
  pezaForm8105: z.string().trim().optional(),
  pezaForm8106: z.string().trim().optional(),
  isRGE: z.boolean().optional(),
  equipmentType: z.string().trim().min(1, 'Equipment type is required'),
  remarks: z.string().trim().optional(),
  deploymentDate: z.date().nullable().optional(),
  recoveredFrom: z.string().trim().optional(),
  recoveryDate: z.date().nullable().optional(),
  client: z.string().trim().optional(),
  license: z.string().trim().optional(),
  version: z.string().trim().optional(),
});

export type AssetFormData = z.infer<typeof AssetSchema>;
