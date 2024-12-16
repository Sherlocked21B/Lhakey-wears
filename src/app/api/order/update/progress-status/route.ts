import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const progress = searchParams.get("progress");
    const userID = searchParams.get("userID");
    const orderID = searchParams.get("orderID");
    console.log("Progress status: ", progress);

    if (!progress || !userID || !orderID)
      return NextResponse.json({
        success: false,
        message: "Progress Status and User ID is required!!!",
      });

    if (!["cancelled", "pending", "delivered", "shipped"].includes(progress)) {
      return NextResponse.json({
        success: false,
        message: "Invalid Progress Status",
      });
    }

    const result = await Order.findOneAndUpdate(
      {
        user: userID,
        _id: orderID,
      },
      { currentProgress: progress },
      { new: true }
    );

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Updated Order Status Successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to update order status! Please try again",
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
