import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email("Enter a valid email address."),
  password: z.string().trim().min(1, 'Password is required.'),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Password confirmation does not match!",
//   path: ["confirmPassword"],
// })

export default SignInSchema;