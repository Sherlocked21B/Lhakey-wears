import connectToDB from "@/database";
import Order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "You are not logged in!!! Please Log In",
      });
    }

    await Order.deleteMany({
      user: id,
      isPaid: false,
      paymentMethod: "esewa",
    });
    const extractAllOrders = await Order.find({ user: id });

    if (extractAllOrders) {
      return NextResponse.json({
        success: true,
        data: extractAllOrders,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to get all orders!!! Please try again",
      });
    }
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later get all order",
    });
  }
}
