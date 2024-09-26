"use server"

import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/email"
import { generateVerificationToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth"
import { z } from "zod"

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(", "),
    }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.password) {
    return {
      error: "Email does not exist",
    }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {
      success: "Confirmation email sent",
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
          }
        default:
          return {
            error: "Something went wrong",
          }
      }
    }

    throw error
  }
}