// app/lib/auth.ts
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Extend next-auth types to include accessToken on Session and JWT
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      scope:
        "openid email profile https://www.googleapis.com/auth/calendar",
      access_type: "offline",   // ← 必須
      prompt: "consent",        // ← 超重要
    },
  },
}),
  ],

  callbacks: {
  async jwt({ token, account }) {
  if (account) {
    console.log("ACCOUNT:", account);
    token.accessToken = account.access_token;
    token.refreshToken = account.refresh_token;
  }
  return token;
}
}
};