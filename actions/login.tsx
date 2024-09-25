"use server"

import { LoginSchema } from "@/schemas"
import { z } from "zod"

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(", "),
    }
  }

  return {
    success: "Login successful",
  }
}