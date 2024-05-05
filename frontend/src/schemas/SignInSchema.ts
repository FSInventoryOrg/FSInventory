import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().min(1, 'Email cannot be empty').email(),
  password: z.string().min(1, 'Password cannot be empty'),
})
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Password confirmation does not match!",
//   path: ["confirmPassword"],
// })

export default SignInSchema;