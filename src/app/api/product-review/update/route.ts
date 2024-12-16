import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import ProductReview from "@/models/review";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const extractData = await req.json();

    const updateProductReview = await ProductReview.findOneAndUpdate(
      {
        _id: extractData._id,
      },
      {
        ...extractData,
      },
      { new: true }
    );

    if (updateProductReview) {
      return NextResponse.json({
        success: true,
        message: "Product Review updated successfully",
      });
    } else {
      console.log(updateProductReview);
      return NextResponse.json({
        success: false,
        message: "Failed to update the product review! Please try again",
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
