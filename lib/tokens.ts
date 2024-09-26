import { getVerificationTokenByEmail } from "@/data/verification-token"
import { v4 as uuid } from "uuid"
import { db } from "./db"
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token"

export async function generateVerificationToken(email: string) {
  const token = uuid()
  const expires = new Date(Date.now() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return verificationToken
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid()
  const expires = new Date(Date.now() + 3600 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return passwordResetToken
}
