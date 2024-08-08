import { z } from 'zod';

export const AssetSchema = z.object({
  code: z.string().trim().min(1, 'Asset code is required'),
  recoveredFrom: z.string().trim().min(1, 'Recovered From is required'),
  recoveryDate: z.date(),
});

export type AssetFormData = z.infer<typeof AssetSchema>;
