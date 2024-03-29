import { User } from '../entities/user'
import { SMTP_FROM } from '../lib/dotenv'
import { mailTransporter } from '../lib/nodemailer'

export async function sendInvitation(user: User) {
  if (!user.loginToken) throw new Error(`User(${user.id}) has no loginToken`)

  await mailTransporter.sendMail({
    from: SMTP_FROM,
    to: user.email,
    subject: 'Authentication link for the peer review app',
    disableFileAccess: true,
    disableUrlAccess: true,
    text: `
Hello ${user.firstname},

Please copy/paste the above code to login on the peer review app for the practical activity.
${user.loginToken}

This code works only once, but can be renewed multiple times.

You will upload your practical activities on that platform.

Reviewing your peer's submissions is also part of the grade.

Good luck and try hard!
    `.trim()
  })
}
