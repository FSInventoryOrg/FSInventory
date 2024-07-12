import { z } from 'zod';

export const UserSchema = z.object({
    firstName: z.string().min(1, 'Cannot be empty'),
    lastName: z.string().min(1, 'Cannot be empty'),
    avatar: z.string()
  })
  
export type UserFormData = z.infer<typeof UserSchema>;