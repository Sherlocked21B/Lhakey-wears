import connectToDB from "@/database";
import ProductReview from "@/models/review";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDB();

    const extractAllProductReviews = await ProductReview.find({});

    if (extractAllProductReviews) {
      return NextResponse.json({
        success: true,
        data: extractAllProductReviews,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No Product Reviews Found",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
