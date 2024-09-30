"use server"

import { signIn } from "@/auth"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confimation"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/email"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth"
import { z } from "zod"

export async function login(values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(", "),
    }
  }

  const { email, password, code } = validatedFields.data

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

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(email)

      if (twoFactorToken?.token !== code) {
        return {
          error: "Invalid code",
        }
      }

      const hasExpired = twoFactorToken?.expires < new Date()

      if (hasExpired) {
        return {
          error: "Code expired",
        }
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id
        }
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(email)

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id
          }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(email)
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token)

      return {
        success: "Two factor email sent",
        twoFactor: true
      }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
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
