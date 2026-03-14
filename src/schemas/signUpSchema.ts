import { z } from "zod";

export const usernameValidattion = z
  .string()
  .min(2, "Username must be alteast 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special character");

export const signUpSchema = z.object({
  username: usernameValidattion,
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
