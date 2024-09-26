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