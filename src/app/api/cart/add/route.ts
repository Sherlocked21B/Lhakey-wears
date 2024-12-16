import connectToDB from "@/database";
import { FormCartSchema } from "@/lib/schemas";
import Cart from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const data = await req.json();
    console.log("add to cart data: ", data);

    const { productID, userID, quantity, size, variant, price } = data;

    const result = FormCartSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.error.message,
      });
    }

    const isCurrentCartItemAlreadyExists = await Cart.find({
      productID: productID,
      userID: userID,
      size: size,
      variant: variant,
      price: price,
    });

    if (isCurrentCartItemAlreadyExists?.length > 0) {
      const newQuantity = isCurrentCartItemAlreadyExists[0].quantity + quantity;
      const updateProductOnCart = await Cart.findOneAndUpdate(
        {
          productID: productID,
          userID: userID,
          size: size,
          variant: variant,
        },
        {
          quantity: newQuantity,
        },
        { new: true }
      );

      if (updateProductOnCart) {
        return NextResponse.json({
          success: true,
          message: "Product is updated to cart !",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add the product to cart ! Please try again.",
        });
      }
    }

    console.log("data right before adding to the database: ", result.data);

    const saveProductToCart = await Cart.create(result.data);

    if (saveProductToCart) {
      return NextResponse.json({
        success: true,
        message: "Product is added to cart !",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "failed to add the product to cart ! Please try again.",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
