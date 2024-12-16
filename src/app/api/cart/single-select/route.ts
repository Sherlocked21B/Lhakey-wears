import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cart";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");
    const id = searchParams.get("id");

    if (!id || !userID)
      return NextResponse.json({
        success: false,
        message: "Cart ID and User ID is required!!!",
      });

    const { selected } = await Cart.findById(id);

    const result = await Cart.findOneAndUpdate(
      {
        _id: id,
      },
      { selected: !selected },
      { new: true }
    );

    if (result) {
      const extractAllCartItems = await Cart.find({
        userID: userID,
      }).populate("productID");
      return NextResponse.json({
        success: true,
        message: "Cart items selected/unselected successfully",
        data: extractAllCartItems,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to select/unselect the cart items! Please try again",
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
