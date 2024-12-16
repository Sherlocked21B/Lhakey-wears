"use client";
import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { logUser, registerUser } from "@/services/auth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useGlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import { LoginSchema, RegisterSchema } from "@/lib/schemas";
import { Button } from "@nextui-org/react";

type AuthFormProps = {
  formType: "login" | "register";
  formFields: { label: string; formType: string; id: string }[];
};

export default function AuthForm({ formType, formFields }: AuthFormProps) {
  const { authUser, setAuthUser, setUser } = useGlobalContext();
  const router = useRouter();

  const SchemaType = RegisterSchema || LoginSchema;

  type FormSchema = z.infer<typeof SchemaType>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormSchema>();

  const onSubmit = async (data: FormSchema) => {
    if (formType === "register") {
      const res = await registerUser(data);
      if (res.success) {
        toast.success(res.message);
        reset();
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } else {
      const res = await logUser(data);
      if (res.success) {
        toast.success(res.message);
        setAuthUser(true);
        setUser(res?.finalData?.user);
        Cookies.set("token", res?.finalData?.token);
        localStorage.setItem("user", JSON.stringify(res?.finalData?.user));
        reset();
      } else {
        toast.error(res.message);
      }
    }
  };

  useEffect(() => {
    authUser && router.push("/");
  }, [authUser]);

  return (
    <div className="shadow-2xl w-4/5 rounded-xl flex flex-col gap-10 justify-center items-center py-16">
      <h2 className="text-brand font-bold text-2xl">
        {formType === "login" ? "Log in to your Account" : "Create an Account"}
      </h2>
      <form
        className="flex flex-col justify-center items-center gap-6 w-[85%]"
        onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((formField) => (
          <TextField
            size="medium"
            key={formField.id}
            fullWidth
            id={formField.id}
            label={formField.label}
            variant="outlined"
            type={formField.formType}
            {...register(formField.id as "email" | "password" | "name")}
          />
        ))}
        <Button isLoading={isSubmitting} type="submit" variant={"bordered"}>
          {formType === "login" ? "Log In" : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
