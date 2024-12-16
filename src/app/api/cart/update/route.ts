import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cart";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (!action)
      return NextResponse.json({
        success: false,
        message: "Action is required!!!",
      });
    const extractData = await req.json();
    const { _id, quantity } = extractData;
    let newQuantity;

    if (action === "increment") {
      newQuantity = quantity + 1;
    } else {
      newQuantity = quantity - 1;
    }

    const updateCart = await Cart.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        ...extractData,
        quantity: newQuantity,
      },
      { new: true }
    );

    if (updateCart) {
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
      });
    } else {
      console.log(updateCart);
      return NextResponse.json({
        success: false,
        message: "Failed to update the product! Please try again",
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
