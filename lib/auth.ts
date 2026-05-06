import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import * as bcrypt from "bcrypt"
import { checkRateLimit } from "./api-utils"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Rate limit: 5 attempts per email per 15 minutes
        const rateLimitKey = `login:${credentials.email.toLowerCase()}`;
        if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
          throw new Error("Demasiados intentos. Esperá 15 minutos.");
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
  },
}
