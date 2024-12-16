import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { registerForm } from "@/lib/mapping";
import Link from "next/link";
import React from "react";

export default function Register() {
  return (
    <div className="my-container flex h-[calc(100vh-120px)] max-h-[800px]">
      <section className="w-1/2 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-10 w-[70%]">
          <h2 className="text-brand font-bold text-2xl">
            Login with Your Account
          </h2>
          <p className="text-center">
            To keep connected with us please login with your personal info.
          </p>
          <Link href="/login">
            <Button size={"lg"} variant={"outline"}>
              Log In
            </Button>
          </Link>
        </div>
      </section>
      <section className="w-1/2 flex justify-center items-center">
        <AuthForm formType="register" formFields={registerForm} />
      </section>
    </div>
  );
}
