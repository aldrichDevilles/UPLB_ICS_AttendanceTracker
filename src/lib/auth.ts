import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({ name: "University account", credentials: { id: { label: "Student ID", type: "text" }, role: { label: "Role", type: "text" } }, async authorize(credentials) {
    if (!credentials?.id) return null;
    return { id: String(credentials.id), name: String(credentials.id), role: credentials.role === "lecturer" ? "lecturer" : "student" };
  } })],
  callbacks: {
    jwt: ({ token, user }) => { if (user) token.role = user.role; return token; },
    session: ({ session, token }) => { if (session.user && token.sub) { session.user.id = token.sub; session.user.role = token.role; } return session; }
  }
};
