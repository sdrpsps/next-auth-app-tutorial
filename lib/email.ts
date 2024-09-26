import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.RESEND_DOMAIN}/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Verify your email",
    html: `<a href=${confirmLink}>Verify your email</a>`,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.RESEND_DOMAIN}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Reset your password",
    html: `<a href=${resetLink}>Reset your password</a>`,
  })
}

export async function sendTwoFactorEmail(email: string, token: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code is ${token}</p>`,
  })
}