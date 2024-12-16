import Order from "@/models/order";
import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({
        success: false,
        message: "Order item ID is required",
      });

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (deletedOrder) {
      return NextResponse.json({
        success: true,
        message: "Order deleted successfully!!!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to delete the order! please try again",
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
