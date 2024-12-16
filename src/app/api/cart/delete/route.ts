import connectToDB from "@/database";
import Cart from "@/models/cart";

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("id");

    if (!userID)
      return NextResponse.json({
        success: false,
        message: "User ID is required",
      });

    const deletedCartItem = await Cart.deleteMany({ userID, selected: true });

    if (deletedCartItem) {
      return NextResponse.json({
        success: true,
        message: "Cart Item(s) deleted successfully!!!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to delete the cart item(s)! please try again",
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
