import connectToDB from "@/database";
import Cart from "@/models/cart";
import Product from "@/models/product";
import ProductQA from "@/models/productqa";
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
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      await Cart.deleteMany({ productID: id });
      await ProductQA.deleteMany({ product: id });
      await ProductReview.deleteMany({ product: id });

      return NextResponse.json({
        success: true,
        message: "Product and related cart items deleted successfully!!!",
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
