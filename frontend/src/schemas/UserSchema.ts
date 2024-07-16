import { z } from 'zod';

export const UserSchema = z.object({
    firstName: z.string().trim().min(1, 'Cannot be empty'),
    lastName: z.string().trim().min(1, 'Cannot be empty'),
  })
  
export type UserFormData = z.infer<typeof UserSchema>;

export interface UserData extends UserFormData {
  avatar?: string; 
}