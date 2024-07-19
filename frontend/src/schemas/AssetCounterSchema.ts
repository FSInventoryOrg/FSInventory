import { z } from 'zod';

export const AssetCounterSchema = z.object({
  category: z.string().trim().optional(),
  prefixCode: z.string().trim().min(1, 'Prefix Code is required'),
  threshold: z.coerce
    .number()
    .min(1, 'Threshold is required')
    .int()
    .positive({ message: 'Threshold must be a positive integer' }),
  counter: z.optional(z.coerce.number().int()),
  type: z.enum(['Hardware', 'Software']),
});

  export type AssetCounterFormData = z.infer<typeof AssetCounterSchema>;