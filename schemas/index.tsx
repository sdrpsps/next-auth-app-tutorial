import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  }),
  password: z.string().min(1, {
    message: "Password is required!"
  })
})

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required!"
  }),
  email: z.string().email({
    message: "Email is required!"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters!"
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters!"
  })
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The passwords do not match",
      path: ['confirmPassword']
    });
  }
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  })
})

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters!"
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters!"
  })
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The passwords do not match",
      path: ['confirmPassword']
    });
  }
});
