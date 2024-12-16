import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order";
import Cart from "@/models/cart";
import { checkStock, substractStock } from "@/services/order";

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
        message: "Order ID and User ID is required!!!",
      });
    const orderDetail = await Order.findById(id);
    if (!orderDetail) {
      return NextResponse.json({
        success: false,
        message: "Order details not found",
      });
    }

    if (orderDetail.isPaid === true) {
      return NextResponse.json({
        success: true,
        message: "Order placed successfully",
      });
    }

    await checkStock(orderDetail.orderItems);

    const result = await Order.findOneAndUpdate(
      {
        user: userID,
        _id: id,
      },
      { isPaid: true },
      { new: true }
    );

    if (result) {
      await Cart.deleteMany({ userID: userID, selected: true });

      await substractStock(orderDetail.orderItems);

      return NextResponse.json({
        success: true,
        message: "Order Placed Successfully...",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to update order payment status! Please try again",
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
