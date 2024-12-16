import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const extractData = await req.json();
    const { _id, name, phoneNumber, address, image } = extractData;

    const updateUser = await User.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        name,
        phoneNumber,
        address,
        image,
      },
      { new: true }
    );

    if (updateUser) {
      return NextResponse.json({
        success: true,
        message: "User updated successfully",
        data: updateUser,
      });
    } else {
      console.log(updateUser);
      return NextResponse.json({
        success: false,
        message: "Failed to update the user! Please try again",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
