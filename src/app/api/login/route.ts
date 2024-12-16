import connectToDB from "@/database";
import { LoginSchema } from "@/lib/schemas";
import User from "@/models/user";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("hello");

  await connectToDB();

  const { email, password } = await req.json();
  console.log(email);

  const result = LoginSchema.safeParse({ email, password });

  if (!result.success) {
    return NextResponse.json({
      success: false,
      message: JSON.parse(result.error.message)[0].message,
    });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return NextResponse.json({
        success: false,
        message: "Account not found with this email",
      });
    }

    const checkPassword = await compare(password, checkUser.password);
    if (!checkPassword) {
      return NextResponse.json({
        success: false,
        message: "Incorrect password. Please try again !",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser?.email,
        role: checkUser?.role,
      },
      "default_secret_key",
      { expiresIn: "1d" }
    );

    const finalData = {
      token,
      user: {
        email: checkUser.email,
        name: checkUser.name,
        _id: checkUser._id,
        role: checkUser.role,
        address: checkUser.address,
        phoneNumber: checkUser.phoneNumber,
        imageUrl: checkUser.imageUrl,
      },
    };

    return NextResponse.json({
      success: true,
      message: "Login successfull",
      finalData,
    });
  } catch (e) {
    console.log("Error while logging In. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
