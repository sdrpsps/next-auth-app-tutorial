import { UserRole } from "@prisma/client";
import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  }),
  password: z.string().min(1, {
    message: "Password is required!"
  }),
  code: z.optional(z.string())
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
}).refine(({ password, confirmPassword }) => {
  if (password && confirmPassword && password !== confirmPassword) {
    return false
  }
  return true
}, {
  message: "The passwords do not match",
  path: ['confirmPassword']
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
}).refine(({ password, confirmPassword }) => {
  if (password && confirmPassword && password !== confirmPassword) {
    return false
  }
  return true
}, {
  message: "The passwords do not match",
  path: ['confirmPassword']
})

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6, {
    message: "Password must be at least 6 characters!"
  })),
  newPassword: z.optional(z.string().min(6, {
    message: "Password must be at least 6 characters!"
  }))
}).refine(({ password, newPassword }) => {
  if (password && !newPassword) {
    return false
  }

  return true
}, {
  message: 'New password is required',
  path: ['newPassword']
}).refine(({ password, newPassword }) => {
  if (!password && newPassword) {
    return false
  }

  return true
}, {
  message: 'password is required',
  path: ['password']
})