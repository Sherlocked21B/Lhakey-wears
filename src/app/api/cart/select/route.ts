import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cart";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userID = searchParams.get("userID");

    if (!userID || !action)
      return NextResponse.json({
        success: false,
        message: "Action and UserID is required!!!",
      });

    let selectValue;

    if (action === "selectAll") {
      selectValue = true;
    } else if (action === "deselectAll") {
      selectValue = false;
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid action!!!",
      });
    }

    const result = await Cart.updateMany(
      { userID: userID },
      { $set: { selected: selectValue } }
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
