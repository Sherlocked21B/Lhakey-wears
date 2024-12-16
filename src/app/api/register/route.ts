import connectToDB from "@/database";
import { RegisterSchema } from "@/lib/schemas";
import User from "@/models/user";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await connectToDB();

  const { name, email, password } = await req.json();

  //validate the schema

  const result = RegisterSchema.safeParse({ name, email, password });

  if (!result.success) {
    console.log(result.error.message);
    return NextResponse.json({
      success: false,
      message: JSON.parse(result.error.message)[0].message,
    });
  }

  try {
    //check if the user is exists or not

    const isUserAlreadyExists = await User.findOne({ email });

    if (isUserAlreadyExists) {
      return NextResponse.json({
        success: false,
        message: "User already exists. Please try with different email.",
      });
    } else {
      const hashPassword = await hash(password, 12);

      const newlyCreatedUser = await User.create({
        name,
        email,
        password: hashPassword,
        role: "user",
      });

      if (newlyCreatedUser) {
        return NextResponse.json({
          success: true,
          message: "Account created successfully.",
        });
      }
    }
  } catch (error) {
    console.log("Error while new user registration. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
