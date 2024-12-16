import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/db";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Resend from "next-auth/providers/resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise),
  theme: {
    logo: "/logo.png",
  },
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role;
      session.user._id = user._id;
      return session;
    },
  },
  providers: [
    Google,
    Resend({
      name: "Email",
      from: "no-reply@lakheywears.com.np",
    }),
  ],
});
