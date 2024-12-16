import connectToDB from "@/database";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    if (!category)
      return NextResponse.json({
        success: false,
        message: "Product Category is required",
      });
    const categoryProducts = await Product.find({ category: category });
    if (categoryProducts) {
      return NextResponse.json({
        success: true,
        data: categoryProducts,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product not found",
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
