"use server"

import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(", "),
    }
  }

  const { email, password, name } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return {
      error: "Email already exists",
    }
  }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  // TODO: Send verification email

  return {
    success: "Register successful",
  }
}