import { getPasswordResetTokenByEmail } from "@/data/password-reset-token"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getVerificationTokenByEmail } from "@/data/verification-token"
import crypto from "crypto"
import { v4 as uuid } from "uuid"
import { db } from "./db"

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

export async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100000, 999999).toString()
  const expires = new Date(Date.now() + 3600 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return twoFactorToken
}
