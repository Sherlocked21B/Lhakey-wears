"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { userProfile } from "@/lib/mapping";
import { Button, Input } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@/lib/schemas";
import { UserType } from "@/lib/types";
import UploadGallery from "../UploadImage";
import { updateUser } from "@/services/user";
import { toast } from "react-toastify";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export default function UserProfileForm({ user }: { user: User }) {
  const session = useSession();
  console.log("Session: ", session);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    defaultValues: {
      _id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
    },
    resolver: zodResolver(UserSchema),
  });

  async function onSubmit(data: UserType) {
    console.log(data);
    const res = await updateUser(data);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="w-full">
      <form>
        <div className="flex justify-between gap-4 flex-wrap">
          {userProfile.map((item) => (
            <Input
              disabled={item.id === "email"}
              key={item.id}
              variant="bordered"
              type="text"
              label={item.label}
              className="w-[48%]"
              {...register(item.id as "name" | "email" | "phoneNumber")}
            />
          ))}
        </div>
        <div className="mt-4 w-[48%]">
          <UploadGallery
            formName="image"
            name="Profile Picture"
            isMultiple={false}
            gallery={user.image ? [user.image] : []}
            setValue={setValue}
          />
        </div>
        <Button
          isLoading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className="bg-[#000d] text-white"
        >
          Update
        </Button>
      </form>
    </div>
  );
}
