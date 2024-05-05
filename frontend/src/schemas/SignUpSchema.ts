import { z } from "zod";

const SignUpSchema = z.object({
  firstName: z.string().min(1, 'Cannot be empty'),
  lastName: z.string().min(1, 'Cannot be empty'),
  role: z.string().min(1, 'Select a role'),
  email: z.string().min(1, 'Email cannot be empty').email("Not a valid email address!"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Password confirmation does not match!",
//   path: ["confirmPassword"],
// })

export default SignUpSchema;