import { z } from 'zod';

export const EmployeeSchema = z.object({
  code: z.string().min(1, "Asset code is required"),
  firstName: z.string().min(1, 'Cannot be empty'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Cannot be empty'),
  position: z.string().min(1, 'Cannot be empty'),
  startDate: z.date(),
  isActive: z.boolean(),
});

export type EmployeeFormData = z.infer<typeof EmployeeSchema>;
