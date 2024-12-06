import { z } from "zod";

export const EmployeeSchema = z.object({
  code: z.string().trim().min(1, "Asset code is required"),
  first_name: z.string().trim().min(1, "Cannot be empty"),
  middle_name: z.string().trim().optional(),
  last_name: z.string().trim().min(1, "Cannot be empty"),
  position: z.string().trim().min(1, "Cannot be empty"),
  startDate: z.date(),
  isActive: z.boolean(),
});

export type EmployeeFormData = z.infer<typeof EmployeeSchema>;
