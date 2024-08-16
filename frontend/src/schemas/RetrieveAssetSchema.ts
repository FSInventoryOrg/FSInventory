import { z } from 'zod';

export const RetrieveAssetSchema = z.object({
  code: z.string().trim().min(1, 'Asset code is required'),
  recoveredFrom: z.string().trim().min(1, 'Recovered From is required'),
  recoveryDate: z.date().optional(),
  status: z.string(),
});

export type AssetFormData = z.infer<typeof RetrieveAssetSchema>;
