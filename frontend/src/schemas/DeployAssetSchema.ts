import { z } from 'zod';

export const AssetSchema = z.object({
  code: z.string().trim().min(1, 'Asset code is required'),
  assignee: z.string().trim().min(1, 'Assignee is required'),
  deploymentDate: z.date(),
});

export type AssetFormData = z.infer<typeof AssetSchema>;
