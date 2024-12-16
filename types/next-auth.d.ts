import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
  interface User {
    _id: string | null;
    role: string | null;
    phoneNumber: string | null;
    address: string | null;
  }
}
