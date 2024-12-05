import { z } from "zod";

const SignUpSchema = z.object({
  first_name: z.string().trim().min(1, "Cannot be empty"),
  last_name: z.string().trim().min(1, "Cannot be empty"),
  role: z.string().trim().min(1, "Select a role"),
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .email("Not a valid email address!"),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Password confirmation does not match!",
//   path: ["confirmPassword"],
// })

export default SignUpSchema;
