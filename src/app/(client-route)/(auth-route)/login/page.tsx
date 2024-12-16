import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { loginForm } from "@/lib/mapping";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div className="my-container flex h-[calc(100vh-120px)] max-h-[800px]">
      <section className="w-1/2 flex justify-center items-center">
        <AuthForm formType="login" formFields={loginForm} />
      </section>
      <section className="w-1/2 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-10 w-[75%]">
          <h2 className="text-brand font-bold text-2xl">Create an Account</h2>
          <p className="text-center">
            Want to discover a great new amount of opportunity?
            <br /> Sign up now and unlock endless style possibilities with
            Lakhey Wears.
          </p>
          <Link href="/register">
            <Button size={"lg"} variant={"outline"}>
              Sign Up
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
