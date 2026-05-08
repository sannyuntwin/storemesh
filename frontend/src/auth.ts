import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Role } from "@/utils/authz";

const DEMO_EMAIL = process.env.AUTH_DEMO_EMAIL?.trim().toLowerCase() || "seller@storemesh.local";
const DEMO_PASSWORD = process.env.AUTH_DEMO_PASSWORD?.trim() || "storemesh123";
const toRole = (value: unknown): Role | null => {
  if (value === "BUYER" || value === "SELLER" || value === "ADMIN") {
    return value;
  }

  return null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
          return null;
        }

        return {
          id: "demo-seller",
          name: "Seller Demo",
          email: DEMO_EMAIL,
          image: null,
          role: "SELLER" satisfies Role
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider;
      }

      if (account?.provider === "google") {
        token.googleId = account.providerAccountId;
        token.role = "BUYER";
      }

      if (account?.provider === "credentials") {
        token.role = "SELLER";
      }

      const userRole = (user as { role?: Role } | undefined)?.role;
      if (userRole) {
        token.role = userRole;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
        session.user.provider = typeof token.provider === "string" ? token.provider : null;
        session.user.googleId = typeof token.googleId === "string" ? token.googleId : null;
        session.user.role = toRole(token.role);
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true
});
