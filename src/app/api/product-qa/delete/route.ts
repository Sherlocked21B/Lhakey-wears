import connectToDB from "@/database";
import ProductQA from "@/models/productqa";
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
        message: "Product QA ID is required",
      });
    const deletedProductQA = await ProductQA.findByIdAndDelete(id);
    if (deletedProductQA) {
      return NextResponse.json({
        success: true,
        message: "Product QA deleted successfully!!!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to delete the product QA! please try again",
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
