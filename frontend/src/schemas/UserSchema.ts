import { z } from "zod";

export const UserSchema = z.object({
  first_name: z.string().trim().min(1, "Cannot be empty"),
  last_name: z.string().trim().min(1, "Cannot be empty"),
});

export type UserFormData = z.infer<typeof UserSchema>;

export interface UserData extends UserFormData {
  avatar?: string;
}
