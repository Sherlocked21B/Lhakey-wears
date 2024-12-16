import connectToDB from "@/database";
import ProductReview from "@/models/review";
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
        message: "Product ID is required",
      });
    const deletedProductReview = await ProductReview.findByIdAndDelete(id);
    if (deletedProductReview) {
      return NextResponse.json({
        success: true,
        message: "Product Review Deleted Successfully!!!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to delete the product! please try again",
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
