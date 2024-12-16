import connectToDB from "@/database";
import User from "@/models/user";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const extractAllAdmins = await User.find({
      role: { $in: ["admin", "super-admin"] },
    });

    if (extractAllAdmins) {
      return NextResponse.json({
        success: true,
        data: extractAllAdmins,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No Admins found",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
