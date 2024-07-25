import { z } from "zod";

export const ForgotPasswordSchema = z.object({
    email: z.string().min(1, "Email cannot be empty").email(),
  });
  
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;