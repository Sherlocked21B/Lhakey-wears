import connectToDB from "@/database";
import Voucher from "@/models/voucher";
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
        message: "Voucher ID is required",
      });
    const deletedProduct = await Voucher.findByIdAndDelete(id);
    if (deletedProduct) {
      return NextResponse.json({
        success: true,
        message: "Voucher deleted successfully!!!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to delete the voucher! please try again",
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
