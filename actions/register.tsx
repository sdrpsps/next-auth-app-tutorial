"use server"

import { RegisterSchema } from "@/schemas"
import { z } from "zod"

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(", "),
    }
  }

  return {
    success: "Register successful",
  }
}