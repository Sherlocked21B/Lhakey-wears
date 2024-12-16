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
        message: "Order ID is required",
      });
    }

    const orderDetail = await Order.findById(id);
    if (orderDetail) {
      return NextResponse.json({
        success: true,
        message: "Order details fetched successfully",
        data: orderDetail,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Order details not found",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again later!!!",
    });
  }
}
