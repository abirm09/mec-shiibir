import { z } from "zod";
const passwordValidatorRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%&*]).{8,}$/;

export const userSchema = z.object({
  fullName: z.string({ required_error: "Fullname is required!" }),
  email: z.string({ required_error: "Email is required!" }),
  password: z
    .string({ required_error: "Password is required" })
    .refine((password) => passwordValidatorRegex.test(password), {
      message:
        "Invalid password. It must be 8 characters long with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$%&*).",
    }),
});
