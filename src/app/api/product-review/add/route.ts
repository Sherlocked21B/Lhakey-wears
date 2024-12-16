import connectToDB from "@/database";
import { ProductReviewSchema } from "@/lib/schemas";
import ProductReview from "@/models/review";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const extractedData = await req.json();
    //validate the schema
    const result = ProductReviewSchema.safeParse(extractedData);

    if (!result.success) {
      console.log(result.error.message);
      return NextResponse.json({
        success: false,
        // message: JSON.parse(result.error.message)[0].message,
        message: JSON.stringify(result.error.message),
      });
    }
    const safeData = result.data;

    const newlyCreatedProduct = await ProductReview.create(safeData);

    if (newlyCreatedProduct) {
      return NextResponse.json({
        success: true,
        message: "Product Review added successfully.",
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
