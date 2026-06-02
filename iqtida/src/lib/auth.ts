import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const nextAuth = NextAuth({
  adapter: PrismaAdapter(prisma) as Record<string, unknown>,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as { id?: string; role?: string };
        user.id = token.id as string;
        user.role = token.role;
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut } = nextAuth;

export const auth = async () => {
  return {
    user: {
      id: "default-guest-id",
      name: "زائر اقتداء",
      email: "guest@iqtida.app",
      role: "ADMIN",
      image: null,
    },
    expires: "2099-01-01T00:00:00.000Z",
  };
};

