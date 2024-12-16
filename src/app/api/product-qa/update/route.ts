import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import ProductQA from "@/models/productqa";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const extractData = await req.json();

    const { userId, _id, ...restOfTheData } = extractData;

    const updateProduct = await ProductQA.findOneAndUpdate(
      {
        _id: _id,
        userId: userId,
      },
      {
        ...restOfTheData,
      },
      { new: true }
    );

    if (updateProduct) {
      return NextResponse.json({
        success: true,
        message: "Product QA updated successfully",
      });
    } else {
      console.log(updateProduct);
      return NextResponse.json({
        success: false,
        message: "Failed to update the product QA! Please try again",
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
