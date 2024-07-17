import { z } from 'zod';

export const AssetCounterSchema = z.object({
    category: z.string().optional(), 
    prefixCode: z.string().min(1 , "Prefix Code is required" ),
    threshold: z
      .number()
      .int()
      .positive({ message: "Threshold must be a positive integer" }),
    counter: z.number().optional(),
  });

  export type AssetCounterFormData = z.infer<typeof AssetCounterSchema>;