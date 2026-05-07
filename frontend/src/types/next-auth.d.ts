import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      provider?: string | null;
      googleId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    googleId?: string;
  }
}
