import connectToDB from "@/database";
import Order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";
require("@/models/user");

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    console.log("Calling get all api for orders");

    await connectToDB();
    const extractAllOrders = await Order.find({}).populate("user");

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
    console.log(e);

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later get all order",
    });
  }
}
