import connectToDB from "@/database";
import Cart from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";
require("@/models/product");

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ success: false, message: "Please log in!" });

    const extractAllCartItems = await Cart.find({ userID: id }).populate(
      "productID"
    );
    // const extractAllCartItems = await Cart.find({ userID: id });
    if (extractAllCartItems) {
      return NextResponse.json({
        success: true,
        data: extractAllCartItems,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No cart items Found!!!",
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
