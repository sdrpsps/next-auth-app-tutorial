import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confimation"
import { getUserById } from "./data/user"
import { db } from "./lib/db"
import { getAccountByUserId } from "./data/account"

export type ExtendedUser = {
  id: string
  role: UserRole
  isTwoFactorEnabled: boolean
  isOAuth: boolean
} & DefaultSession["user"]

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id!)

      if (!existingUser || !existingUser.emailVerified) return false

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if (!twoFactorConfirmation) {
          return false
        }

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        })
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.isOAuth) {
        session.user.isOAuth = token.isOAuth as boolean;
      }

      if (session.user && token.name) {
        session.user.name = token.name;
      }

      if (session.user && token.email) {
        session.user.email = token.email;
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }

      if (session.user && token.isTwoFactorEnabled) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})

