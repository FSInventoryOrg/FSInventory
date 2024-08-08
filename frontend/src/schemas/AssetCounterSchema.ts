import { z } from 'zod';

export const AssetCounterSchema = z.object({
  category: z.string().trim().optional(),
  prefixCode: z
    .string({ required_error: 'Prefix Code is required' })
    .trim()
    .min(1, 'Prefix Code is required'),
  threshold: z.coerce
    .number({
      required_error: 'Threshold is required',
      invalid_type_error: 'Invalid input. Please enter a number',
    })
    .int()
    .min(1, 'Threshold is required')
    .positive({ message: 'Threshold must be a positive integer' }),
  counter: z.optional(
    z.coerce
      .number({ invalid_type_error: 'Invalid input. Please enter a number' })
      .int()
  ),
  type: z.enum(['Hardware', 'Software']),
});
export type AssetCounterFormData = z.infer<typeof AssetCounterSchema>;