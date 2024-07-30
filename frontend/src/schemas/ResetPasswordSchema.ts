
import { z } from "zod";


export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ResetPasswordSchemaWithOTP = ResetPasswordSchema.and(
  z.object({
     otp: z.string().min(6, "OTP must be at least 6 characters")
    })
  );


export type ResetPasswordFormData = {
    newPassword: string 
    token?: string
}

const CurrentWithNewPasswordSchema = z.object({
    currentPassword: z.string().min(1, "Password cannot be empty"),
    newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters"),
    
  }).refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password.",
      path: ["newPassword"]
})

export const ChangePasswordSchema = z.intersection(ResetPasswordSchema, CurrentWithNewPasswordSchema)

export type ChangePasswordFormData = z.infer<typeof CurrentWithNewPasswordSchema>;